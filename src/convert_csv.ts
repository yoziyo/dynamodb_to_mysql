import { readdir, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import { unparse } from 'papaparse';
import { printError, printLog } from './util/logger';
import { exportFilepath } from './util/constants';

const filepath = exportFilepath;
const columnSuffix = '_dyn';

const converter = (table: string, isDelete: boolean): void => {
  readdir(`${filepath}${table}`, async (err, files) => {
    if (err) {
      printError(err.message);
      return false;
    }

    const filesList = files.filter((e) => {
      return path.extname(e).toLowerCase() === '.json';
    });

    if (!files.length) {
      printError('변환할 파일이 없습니다!');
      return false;
    }

    printLog(`${filesList.length}개의 파일 변환 시작`);

    for (const file of filesList) {
      const result = await jsonToCsv(file, table, isDelete);
      printLog(result);
    }
  });
};

const jsonToCsv = async (
  filename: string,
  table: string,
  isDelete: boolean,
) => {
  return new Promise<string>(async (resolve, reject) => {
    const jsonFileData = readFileSync(
      `${filepath}${table}/${filename}`,
      'utf-8',
    );

    const jsonData = JSON.parse(jsonFileData);
    const headers: string[] = [];

    const allRows: string[] = [];

    // header 데이터 정렬
    jsonData.forEach((data: { [key: string]: string }) => {
      Object.keys(data).forEach((key: string) => {
        if (headers.indexOf(`${key.trim()}${columnSuffix}`) === -1) {
          headers.push(`${key.trim()}${columnSuffix}`);
        }
      });
    });

    // 데이터 삽입 및 특수문자 대응
    jsonData.forEach((data: { [key: string]: string }) => {
      const rows: string[] = Array(headers.length).fill('\\N');
      Object.keys(data).forEach((key: string) => {
        rows[headers.indexOf(`${key.trim()}${columnSuffix}`)] =
          String(data[key]) !== '\\N' &&
          String(data[key]).replace(/\\/gi, '\\\\');
      });
      allRows.push(`${unparse([rows])},`);
    });

    const csv = `${unparse([headers])}\r\n` + allRows.join('\r\n');
    const csvFileName = `${path.parse(filename).name}.${jsonData.length}.csv`;

    await writeFileSync(`${filepath}${table}/${csvFileName}`, csv, 'utf8');

    if (isDelete) {
      await unlinkSync(`${filepath}${table}/${filename}`);
      printLog(`${filename} 제거 완료`);
    }

    resolve(`${csvFileName} 생성 완료`);
  });
};

export = converter;
