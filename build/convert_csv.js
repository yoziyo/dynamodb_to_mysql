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
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var papaparse_1 = require("papaparse");
var logger_1 = require("./util/logger");
var constants_1 = require("./util/constants");
var filepath = constants_1.exportFilepath;
var columnSuffix = '_dyn';
var converter = function (table, isDelete) {
    fs_1.readdir("" + filepath + table, function (err, files) { return __awaiter(void 0, void 0, void 0, function () {
        var filesList, filesList_1, filesList_1_1, file, result, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (err) {
                        logger_1.printError(err.message);
                        return [2 /*return*/, false];
                    }
                    filesList = files.filter(function (e) {
                        return path_1.default.extname(e).toLowerCase() === '.json';
                    });
                    if (!files.length) {
                        logger_1.printError('변환할 파일이 없습니다!');
                        return [2 /*return*/, false];
                    }
                    logger_1.printLog(filesList.length + "\uAC1C\uC758 \uD30C\uC77C \uBCC0\uD658 \uC2DC\uC791");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    filesList_1 = __values(filesList), filesList_1_1 = filesList_1.next();
                    _b.label = 2;
                case 2:
                    if (!!filesList_1_1.done) return [3 /*break*/, 5];
                    file = filesList_1_1.value;
                    return [4 /*yield*/, jsonToCsv(file, table, isDelete)];
                case 3:
                    result = _b.sent();
                    logger_1.printLog(result);
                    _b.label = 4;
                case 4:
                    filesList_1_1 = filesList_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (filesList_1_1 && !filesList_1_1.done && (_a = filesList_1.return)) _a.call(filesList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
var jsonToCsv = function (filename, table, isDelete) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var jsonFileData, jsonData, headers, allRows, csv, csvFileName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs_1.readFileSync("" + filepath + table + "/" + filename, 'utf-8')];
                        case 1:
                            jsonFileData = _a.sent();
                            jsonData = JSON.parse(jsonFileData);
                            headers = [];
                            allRows = [];
                            // header 데이터 정렬
                            jsonData.forEach(function (data) {
                                Object.keys(data).forEach(function (key) {
                                    if (headers.indexOf("" + key.trim() + columnSuffix) === -1) {
                                        headers.push("" + key.trim() + columnSuffix);
                                    }
                                });
                            });
                            // 데이터 삽입 및 특수문자 대응
                            jsonData.forEach(function (data) {
                                var rows = Array(headers.length).fill('\\N');
                                Object.keys(data).forEach(function (key) {
                                    rows[headers.indexOf("" + key.trim() + columnSuffix)] =
                                        String(data[key]) !== '\\N' &&
                                            String(data[key]).replace(/\\/gi, '\\\\');
                                });
                                allRows.push(papaparse_1.unparse([rows]) + ",");
                            });
                            csv = papaparse_1.unparse([headers]) + "\r\n" + allRows.join('\r\n');
                            csvFileName = path_1.default.parse(filename).name + "." + jsonData.length + ".csv";
                            return [4 /*yield*/, fs_1.writeFileSync("" + filepath + table + "/" + csvFileName, csv, 'utf8')];
                        case 2:
                            _a.sent();
                            if (!isDelete) return [3 /*break*/, 4];
                            return [4 /*yield*/, fs_1.unlinkSync("" + filepath + table + "/" + filename)];
                        case 3:
                            _a.sent();
                            logger_1.printLog(filename + " \uC81C\uAC70 \uC644\uB8CC");
                            _a.label = 4;
                        case 4:
                            resolve(csvFileName + " \uC0DD\uC131 \uC644\uB8CC");
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
module.exports = converter;
//# sourceMappingURL=convert_csv.js.map