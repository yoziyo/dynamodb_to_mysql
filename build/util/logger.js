"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = exports.printLog = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ko");
const chalk_1 = __importDefault(require("chalk"));
const getTime = () => dayjs_1.default().locale('ko').format('YYYY-MM-DD HH:mm:ss');
const printLog = (log) => {
    console.info(chalk_1.default.bgBlackBright(`${getTime()}`), log);
};
exports.printLog = printLog;
const printError = (log) => {
    console.error(chalk_1.default.bgRedBright(`${getTime()}`), chalk_1.default.bold.red(log));
};
exports.printError = printError;
//# sourceMappingURL=logger.js.map