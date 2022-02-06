"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = exports.printLog = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ko");
var chalk_1 = __importDefault(require("chalk"));
var getTime = function () { return dayjs_1.default().locale('ko').format('YYYY-MM-DD HH:mm:ss'); };
var printLog = function (log) {
    console.info(chalk_1.default.bgBlackBright("" + getTime()), log);
};
exports.printLog = printLog;
var printError = function (log) {
    console.error(chalk_1.default.bgRedBright("" + getTime()), chalk_1.default.bold.red(log));
};
exports.printError = printError;
//# sourceMappingURL=logger.js.map