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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var promise_1 = require("mysql2/promise");
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var logger_1 = require("./util/logger");
var chalk_1 = __importDefault(require("chalk"));
var constants_1 = require("./util/constants");
var filepath = constants_1.exportFilepath;
// TODO: POOL 사용을 고려해봐야 할 듯
var connection = null;
var tableCreated = false;
var migration = function (_a, exportTable, isDelete, isForceUpdate) {
    var MYSQL_HOST = _a.MYSQL_HOST, MYSQL_PORT = _a.MYSQL_PORT, MYSQL_DATABASE = _a.MYSQL_DATABASE, MYSQL_PASSWORD = _a.MYSQL_PASSWORD, MYSQL_USER = _a.MYSQL_USER;
    return __awaiter(void 0, void 0, void 0, function () {
        var err_1, _b, rows, files, csvFiles_1, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, promise_1.createConnection({
                        host: MYSQL_HOST,
                        user: MYSQL_USER,
                        password: MYSQL_PASSWORD,
                        database: MYSQL_DATABASE,
                        port: parseInt(MYSQL_PORT),
                    })];
                case 1:
                    connection = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, connection.connect()];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    logger_1.printError("\uB370\uC774\uD130\uBCA0\uC774\uC2A4\uC5D0 \uC811\uADFC \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. (" + err_1.message + ")");
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, connection.query("select exists (\n    select 1 FROM Information_schema.tables\n    WHERE table_schema = '" + MYSQL_DATABASE + "'\n    AND table_name = '" + exportTable + "'\n  ) AS isExists")];
                case 6:
                    _b = __read.apply(void 0, [_c.sent(), 1]), rows = _b[0];
                    if (!rows[0].isExists) return [3 /*break*/, 9];
                    if (!isForceUpdate) return [3 /*break*/, 8];
                    return [4 /*yield*/, connection.query("DROP TABLE " + exportTable)];
                case 7:
                    _c.sent();
                    logger_1.printLog(exportTable + " \uD14C\uC774\uBE14 \uC81C\uAC70 \uD6C4 \uC2DC\uC791");
                    return [3 /*break*/, 9];
                case 8:
                    tableCreated = true;
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, fs_1.readdirSync("" + filepath + exportTable)];
                case 10:
                    files = _c.sent();
                    csvFiles_1 = files.filter(function (file) {
                        return path_1.default.extname(file).toLowerCase() === '.csv';
                    });
                    if (!csvFiles_1.length) {
                        throw new Error('처리할 파일이 없습니다!');
                    }
                    logger_1.printLog(csvFiles_1.length + "\uAC1C\uC758 \uD30C\uC77C migration \uC2DC\uC791");
                    (function () { return __awaiter(void 0, void 0, void 0, function () {
                        var csvFiles_2, csvFiles_2_1, file, result, e_1_1;
                        var e_1, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                // LOAD DATA 설정 해제
                                return [4 /*yield*/, connection.query('SET GLOBAL local_infile=1')];
                                case 1:
                                    // LOAD DATA 설정 해제
                                    _b.sent();
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 7, 8, 9]);
                                    csvFiles_2 = __values(csvFiles_1), csvFiles_2_1 = csvFiles_2.next();
                                    _b.label = 3;
                                case 3:
                                    if (!!csvFiles_2_1.done) return [3 /*break*/, 6];
                                    file = csvFiles_2_1.value;
                                    return [4 /*yield*/, onMigration(file, exportTable, MYSQL_DATABASE)];
                                case 4:
                                    result = _b.sent();
                                    logger_1.printLog(result);
                                    _b.label = 5;
                                case 5:
                                    csvFiles_2_1 = csvFiles_2.next();
                                    return [3 /*break*/, 3];
                                case 6: return [3 /*break*/, 9];
                                case 7:
                                    e_1_1 = _b.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 9];
                                case 8:
                                    try {
                                        if (csvFiles_2_1 && !csvFiles_2_1.done && (_a = csvFiles_2.return)) _a.call(csvFiles_2);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 9:
                                    if (!isDelete) return [3 /*break*/, 11];
                                    return [4 /*yield*/, fs_1.rmSync("" + filepath + exportTable, {
                                            recursive: true,
                                            force: true,
                                        })];
                                case 10:
                                    _b.sent();
                                    logger_1.printLog(exportTable + " \uB370\uC774\uD130 \uC0AD\uC81C \uC644\uB8CC");
                                    _b.label = 11;
                                case 11: 
                                // LOAD DATA 설정 복원
                                return [4 /*yield*/, connection.query('SET GLOBAL local_infile=0')];
                                case 12:
                                    // LOAD DATA 설정 복원
                                    _b.sent();
                                    connection.end();
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                    return [3 /*break*/, 12];
                case 11:
                    err_2 = _c.sent();
                    logger_1.printError(err_2);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
};
var onMigration = function (filename, exportTable, database) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var csvData, headers, columns, _a, columns, existsColumns, headersArray, existsColumnsArray_1, diffColumns, diffColumns_1, diffColumns_1_1, column, e_2_1, loadDataSQL, response, updateCount, percent;
                var e_2, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, fs_1.readFileSync("" + filepath + exportTable + "/" + filename, 'utf-8').split('\r\n')];
                        case 1:
                            csvData = _c.sent();
                            headers = csvData[0];
                            if (!!tableCreated) return [3 /*break*/, 3];
                            columns = headers.split(',').map(function (header) {
                                return header + " TEXT NULL";
                            });
                            return [4 /*yield*/, connection.query("CREATE TABLE " + exportTable + " (" + columns.join(',') + ")")];
                        case 2:
                            _c.sent();
                            logger_1.printLog(exportTable + " \uD14C\uC774\uBE14 \uC0DD\uC131");
                            tableCreated = true;
                            return [3 /*break*/, 12];
                        case 3: return [4 /*yield*/, connection.query("select GROUP_CONCAT(column_name, '') as columns from INFORMATION_SCHEMA.columns \n        where table_schema='" + database + "'\n        and table_name= '" + exportTable + "'\n        order by ordinal_position")];
                        case 4:
                            _a = __read.apply(void 0, [_c.sent(), 1]), columns = _a[0];
                            existsColumns = columns[0].columns;
                            headersArray = headers.split(',');
                            existsColumnsArray_1 = existsColumns.split(',');
                            diffColumns = headersArray.filter(function (header) { return !existsColumnsArray_1.includes("" + header); });
                            if (!diffColumns.length) return [3 /*break*/, 12];
                            _c.label = 5;
                        case 5:
                            _c.trys.push([5, 10, 11, 12]);
                            diffColumns_1 = __values(diffColumns), diffColumns_1_1 = diffColumns_1.next();
                            _c.label = 6;
                        case 6:
                            if (!!diffColumns_1_1.done) return [3 /*break*/, 9];
                            column = diffColumns_1_1.value;
                            return [4 /*yield*/, connection.query("ALTER TABLE " + exportTable + " ADD COLUMN " + column + " TEXT NULL DEFAULT NULL")];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8:
                            diffColumns_1_1 = diffColumns_1.next();
                            return [3 /*break*/, 6];
                        case 9: return [3 /*break*/, 12];
                        case 10:
                            e_2_1 = _c.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 12];
                        case 11:
                            try {
                                if (diffColumns_1_1 && !diffColumns_1_1.done && (_b = diffColumns_1.return)) _b.call(diffColumns_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                            return [7 /*endfinally*/];
                        case 12:
                            loadDataSQL = "LOAD DATA LOCAL INFILE '" + filepath + exportTable + "/" + filename + "' INTO TABLE " + exportTable + " FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (" + headers + ")";
                            return [4 /*yield*/, connection.query({
                                    sql: loadDataSQL,
                                    values: [],
                                    infileStreamFactory: function () {
                                        return fs_1.createReadStream("" + filepath + exportTable + "/" + filename);
                                    },
                                })];
                        case 13:
                            response = (_c.sent());
                            updateCount = parseInt(filename.split('.')[1]);
                            percent = Math.floor((response[0].affectedRows / updateCount) * 100);
                            resolve(filename + " \uD30C\uC77C, " + updateCount + "\uAC1C \uC911 " + response[0].affectedRows + "\uAC1C (" + (percent === 100
                                ? chalk_1.default.bold.greenBright(percent + '%')
                                : chalk_1.default.bold.red(percent + '%')) + ") \uC0BD\uC785 \uC644\uB8CC.");
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
module.exports = migration;
//# sourceMappingURL=mysql_migration.js.map