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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const papaparse_1 = require("papaparse");
const logger_1 = require("./util/logger");
const constants_1 = require("./util/constants");
const filepath = constants_1.exportFilepath;
const columnSuffix = '_dyn';
const converter = (table, isDelete) => {
    fs_1.readdir(`${filepath}${table}`, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            logger_1.printError(err.message);
            return false;
        }
        const filesList = files.filter((e) => {
            return path_1.default.extname(e).toLowerCase() === '.json';
        });
        if (!files.length) {
            logger_1.printError('변환할 파일이 없습니다!');
            return false;
        }
        logger_1.printLog(`${filesList.length}개의 파일 변환 시작`);
        for (const file of filesList) {
            const result = yield jsonToCsv(file, table, isDelete);
            logger_1.printLog(result);
        }
    }));
};
const jsonToCsv = (filename, table, isDelete) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const jsonFileData = fs_1.readFileSync(`${filepath}${table}/${filename}`, 'utf-8');
        const jsonData = JSON.parse(jsonFileData);
        const headers = [];
        const allRows = [];
        // header 데이터 정렬
        jsonData.forEach((data) => {
            Object.keys(data).forEach((key) => {
                if (headers.indexOf(`${key.trim()}${columnSuffix}`) === -1) {
                    headers.push(`${key.trim()}${columnSuffix}`);
                }
            });
        });
        // 데이터 삽입 및 특수문자 대응
        jsonData.forEach((data) => {
            const rows = Array(headers.length).fill('\\N');
            Object.keys(data).forEach((key) => {
                rows[headers.indexOf(`${key.trim()}${columnSuffix}`)] =
                    String(data[key]) !== '\\N' &&
                        String(data[key]).replace(/\\/gi, '\\\\');
            });
            allRows.push(`${papaparse_1.unparse([rows])},`);
        });
        const csv = `${papaparse_1.unparse([headers])}\r\n` + allRows.join('\r\n');
        const csvFileName = `${path_1.default.parse(filename).name}.${jsonData.length}.csv`;
        yield fs_1.writeFileSync(`${filepath}${table}/${csvFileName}`, csv, 'utf8');
        if (isDelete) {
            yield fs_1.unlinkSync(`${filepath}${table}/${filename}`);
            logger_1.printLog(`${filename} 제거 완료`);
        }
        resolve(`${csvFileName} 생성 완료`);
    }));
});
module.exports = converter;
//# sourceMappingURL=convert_csv.js.map