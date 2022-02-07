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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var fs_1 = require("fs");
var config_1 = __importDefault(require("./config"));
var convert_csv_1 = __importDefault(require("./convert_csv"));
var dynamodb_to_json_1 = __importDefault(require("./dynamodb_to_json"));
var mysql_migration_1 = __importDefault(require("./mysql_migration"));
var logger_1 = require("./util/logger");
var constants_1 = require("./util/constants");
var program = new commander_1.Command();
var commander = function (config) {
    program
        .command('init')
        .description('설정 파일을 생성합니다.')
        .action(function () {
        try {
            config_1.default();
            logger_1.printLog("설정파일 생성 완료. config.json 파일을 수정한 뒤 '--help' 를 입력하여 진행 하여 주세요!");
        }
        catch (err) {
            logger_1.printError("\uC124\uC815\uD30C\uC77C \uC0DD\uC131 \uC2E4\uD328 " + err);
        }
    });
    program
        .command('export')
        .description('dynamodb 데이터를 json 으로 추출 합니다.')
        .requiredOption('-t, --table <table>', 'dynamodb table 이름을 입력합니다.')
        .action(function (options) {
        dynamodb_to_json_1.default(config, options.table);
    });
    program
        .command('convert')
        .description('추출된 데이터를 csv로 변환 합니다.')
        .requiredOption('-t, --table <table>', '변환할 dynamodb table을 입력합니다. (export/{table})')
        .option('-d, --delete', 'csv 파일 생성 후 json 파일을 모두 삭제 합니다.')
        .action(function (options) {
        convert_csv_1.default(options.table, options.delete);
    });
    program
        .command('migration')
        .description('csv로 추출된 데이터를 mysql에 bulk insert 합니다.')
        .requiredOption('-t, --table <table>', '추출 된 dynamodb table을 입력 합니다.')
        .option('-f, --force', '생성된 테이블이 있다면 제거하고 진행합니다.')
        .option('-d, --delete', 'migration 후 데이터를 삭제합니다.')
        .action(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mysql_migration_1.default(config, options.table, options.delete, options.force)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    program.parse(process.argv);
};
fs_1.stat(constants_1.configFilepath, function (err) { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        if (process.argv[2] !== 'init') {
            if (err) {
                return [2 /*return*/, logger_1.printError("\uC124\uC815\uD30C\uC77C\uC774 \uC874\uC7AC\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. init \uBA85\uB839\uC5B4\uB97C \uBA3C\uC800 \uC2E4\uD589\uD574 \uC8FC\uC138\uC694.")];
            }
            config = fs_1.readFileSync(constants_1.configFilepath, 'utf-8');
            commander(JSON.parse(config));
        }
        else {
            commander();
        }
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=index.js.map