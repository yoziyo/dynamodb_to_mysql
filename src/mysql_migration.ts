import { Connection, createConnection } from 'mysql2/promise';
import { readdirSync, readFileSync, createReadStream, rmSync } from 'fs';
import path from 'path';

import { Config } from './index';
import { printLog, printError } from './util/logger';

import chalk from 'chalk';
import { exportFilepath } from './util/constants';

type isExists = {
  isExists: boolean;
};

const filepath = exportFilepath;

// TODO: POOL 사용을 고려
let connection = null as Connection;
let tableCreated = false;

const migration = async (
  {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_DATABASE,
    MYSQL_PASSWORD,
    MYSQL_USER,
  }: Config,
  exportTable: string,
  isDelete: boolean,
  isForceUpdate: boolean,
): Promise<void> => {
  connection = await createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: parseInt(MYSQL_PORT),
  });

  try {
    await connection.connect();
  } catch (err) {
    printError(`데이터베이스에 접근 할 수 없습니다. (${err.message})`);
  }

  const [rows] = await connection.query(
    `select exists (
    select 1 FROM Information_schema.tables
    WHERE table_schema = '${MYSQL_DATABASE}'
    AND table_name = '${exportTable}'
  ) AS isExists`,
  );

  if ((rows as Array<isExists>)[0].isExists) {
    if (isForceUpdate) {
      await connection.query(`DROP TABLE ${exportTable}`);
      printLog(`${exportTable} 테이블 제거 후 시작`);
    } else {
      tableCreated = true;
    }
  }

  try {
    const files = await readdirSync(`${filepath}${exportTable}`);
    const csvFiles = files.filter((file) => {
      return path.extname(file).toLowerCase() === '.csv';
    });
    if (!csvFiles.length) {
      throw new Error('처리할 파일이 없습니다!');
    }

    printLog(`${csvFiles.length}개의 파일 migration 시작`);

    (async () => {
      // LOAD DATA 설정 해제
      await connection.query('SET GLOBAL local_infile=1');

      for (const file of csvFiles) {
        const result = await onMigration(file, exportTable, MYSQL_DATABASE);
        printLog(result);
      }

      if (isDelete) {
        await rmSync(`${filepath}${exportTable}`, {
          recursive: true,
          force: true,
        });
        printLog(`${exportTable} 데이터 삭제 완료`);
      }

      // LOAD DATA 설정 복원
      await connection.query('SET GLOBAL local_infile=0');
      connection.end();
    })();
  } catch (err) {
    printError(err);
  }
};

const onMigration = async (
  filename: string,
  exportTable: string,
  database: string,
) => {
  return new Promise<string>(async (resolve, reject) => {
    const csvData = await readFileSync(
      `${filepath}${exportTable}/${filename}`,
      'utf-8',
    ).split('\r\n');

    const headers = csvData[0];
    if (!tableCreated) {
      const columns = headers.split(',').map((header) => {
        return `${header} TEXT NULL`;
      });

      await connection.query(
        `CREATE TABLE ${exportTable} (${columns.join(',')})`,
      );

      printLog(`${exportTable} 테이블 생성`);

      tableCreated = true;
    } else {
      // 생성 되어져 있다면, 테이블 컬럼만 비교 후 업데이트
      const [columns] = await connection.query(
        `select GROUP_CONCAT(column_name, '') as columns from INFORMATION_SCHEMA.columns 
        where table_schema='${database}'
        and table_name= '${exportTable}'
        order by ordinal_position`,
      );

      const existsColumns = (columns as Array<{ columns: string }>)[0].columns;

      const headersArray = headers.split(',');
      const existsColumnsArray = existsColumns.split(',');

      const diffColumns = headersArray.filter(
        (header) => !existsColumnsArray.includes(`${header}`),
      );

      if (diffColumns.length) {
        for (const column of diffColumns) {
          await connection.query(
            `ALTER TABLE ${exportTable} ADD COLUMN ${column} TEXT NULL DEFAULT NULL`,
          );
        }
      }
    }

    // TODO: 트랜젝션 필요
    // 데이터 삽입
    const loadDataSQL = `LOAD DATA LOCAL INFILE '${filepath}${exportTable}/${filename}' INTO TABLE ${exportTable} FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (${headers})`;

    // connection.query 의 타입중에 아직 infileStreamFactory가 아직 없음
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await (connection.query as any)({
      sql: loadDataSQL,
      values: [],
      infileStreamFactory: () =>
        createReadStream(`${filepath}${exportTable}/${filename}`),
    })) as Array<{ affectedRows: number }>;

    const updateCount = parseInt(filename.split('.')[1]);
    const percent = Math.floor((response[0].affectedRows / updateCount) * 100);

    resolve(
      `${filename} 파일, ${updateCount}개 중 ${response[0].affectedRows}개 (${
        percent === 100
          ? chalk.bold.greenBright(percent + '%')
          : chalk.bold.red(percent + '%')
      }) 삽입 완료.`,
    );
  });
};

export = migration;
