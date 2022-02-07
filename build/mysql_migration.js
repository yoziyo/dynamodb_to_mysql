"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const promise_1 = require("mysql2/promise");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./util/logger");
const chalk_1 = __importDefault(require("chalk"));
const constants_1 = require("./util/constants");
const filepath = constants_1.exportFilepath;
// TODO: POOL 사용을 고려
let connection = null;
let tableCreated = false;
const migration = ({ MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER, }, exportTable, isDelete, isForceUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    connection = yield promise_1.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        port: parseInt(MYSQL_PORT),
    });
    try {
        yield connection.connect();
    }
    catch (err) {
        logger_1.printError(`데이터베이스에 접근 할 수 없습니다. (${err.message})`);
    }
    const [rows] = yield connection.query(`select exists (
    select 1 FROM Information_schema.tables
    WHERE table_schema = '${MYSQL_DATABASE}'
    AND table_name = '${exportTable}'
  ) AS isExists`);
    if (rows[0].isExists) {
        if (isForceUpdate) {
            yield connection.query(`DROP TABLE ${exportTable}`);
            logger_1.printLog(`${exportTable} 테이블 제거 후 시작`);
        }
        else {
            tableCreated = true;
        }
    }
    try {
        const files = yield fs_1.readdirSync(`${filepath}${exportTable}`);
        const csvFiles = files.filter((file) => {
            return path_1.default.extname(file).toLowerCase() === '.csv';
        });
        if (!csvFiles.length) {
            throw new Error('처리할 파일이 없습니다!');
        }
        logger_1.printLog(`${csvFiles.length}개의 파일 migration 시작`);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            // LOAD DATA 설정 해제
            yield connection.query('SET GLOBAL local_infile=1');
            for (const file of csvFiles) {
                const result = yield onMigration(file, exportTable, MYSQL_DATABASE);
                logger_1.printLog(result);
            }
            if (isDelete) {
                yield fs_1.rmSync(`${filepath}${exportTable}`, {
                    recursive: true,
                    force: true,
                });
                logger_1.printLog(`${exportTable} 데이터 삭제 완료`);
            }
            // LOAD DATA 설정 복원
            yield connection.query('SET GLOBAL local_infile=0');
            connection.end();
        }))();
    }
    catch (err) {
        logger_1.printError(err);
    }
});
const onMigration = (filename, exportTable, database) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const csvData = yield fs_1.readFileSync(`${filepath}${exportTable}/${filename}`, 'utf-8').split('\r\n');
        const headers = csvData[0];
        if (!tableCreated) {
            const columns = headers.split(',').map((header) => {
                return `${header} TEXT NULL`;
            });
            yield connection.query(`CREATE TABLE ${exportTable} (${columns.join(',')})`);
            logger_1.printLog(`${exportTable} 테이블 생성`);
            tableCreated = true;
        }
        else {
            // 생성 되어져 있다면, 테이블 컬럼만 비교 후 업데이트
            const [columns] = yield connection.query(`select GROUP_CONCAT(column_name, '') as columns from INFORMATION_SCHEMA.columns 
        where table_schema='${database}'
        and table_name= '${exportTable}'
        order by ordinal_position`);
            const existsColumns = columns[0].columns;
            const headersArray = headers.split(',');
            const existsColumnsArray = existsColumns.split(',');
            const diffColumns = headersArray.filter((header) => !existsColumnsArray.includes(`${header}`));
            if (diffColumns.length) {
                for (const column of diffColumns) {
                    yield connection.query(`ALTER TABLE ${exportTable} ADD COLUMN ${column} TEXT NULL DEFAULT NULL`);
                }
            }
        }
        // TODO: 트랜젝션 필요
        // 데이터 삽입
        const loadDataSQL = `LOAD DATA LOCAL INFILE '${filepath}${exportTable}/${filename}' INTO TABLE ${exportTable} FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (${headers})`;
        // connection.query 의 타입중에 아직 infileStreamFactory가 아직 없음
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (yield connection.query({
            sql: loadDataSQL,
            values: [],
            infileStreamFactory: () => fs_1.createReadStream(`${filepath}${exportTable}/${filename}`),
        }));
        const updateCount = parseInt(filename.split('.')[1]);
        const percent = Math.floor((response[0].affectedRows / updateCount) * 100);
        resolve(`${filename} 파일, ${updateCount}개 중 ${response[0].affectedRows}개 (${percent === 100
            ? chalk_1.default.bold.greenBright(percent + '%')
            : chalk_1.default.bold.red(percent + '%')}) 삽입 완료.`);
    }));
});
module.exports = migration;
//# sourceMappingURL=mysql_migration.js.map