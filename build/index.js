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
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = require("fs");
const config_1 = __importDefault(require("./config"));
const convert_csv_1 = __importDefault(require("./convert_csv"));
const dynamodb_to_json_1 = __importDefault(require("./dynamodb_to_json"));
const mysql_migration_1 = __importDefault(require("./mysql_migration"));
const logger_1 = require("./util/logger");
const constants_1 = require("./util/constants");
const program = new commander_1.Command();
const commander = (config) => {
    program
        .command('init')
        .description('설정 파일을 생성합니다.')
        .action(() => {
        try {
            config_1.default();
            logger_1.printLog("설정파일 생성 완료. config.json 파일을 수정한 뒤 '--help' 를 입력하여 진행 하여 주세요!");
        }
        catch (err) {
            logger_1.printError(`설정파일 생성 실패 ${err}`);
        }
    });
    program
        .command('export')
        .description('dynamodb 데이터를 json 으로 추출 합니다.')
        .requiredOption('-t, --table <table>', 'dynamodb table 이름을 입력합니다.')
        .action((options) => {
        dynamodb_to_json_1.default(config, options.table);
    });
    program
        .command('convert')
        .description('추출된 데이터를 csv로 변환 합니다.')
        .requiredOption('-t, --table <table>', '변환할 dynamodb table을 입력합니다. (export/{table})')
        .option('-d, --delete', 'csv 파일 생성 후 json 파일을 모두 삭제 합니다.')
        .action((options) => {
        convert_csv_1.default(options.table, options.delete);
    });
    program
        .command('migration')
        .description('csv로 추출된 데이터를 mysql에 bulk insert 합니다.')
        .requiredOption('-t, --table <table>', '추출 된 dynamodb table을 입력 합니다.')
        .option('-f, --force', '생성된 테이블이 있다면 제거하고 진행합니다.')
        .option('-d, --delete', 'migration 후 데이터를 삭제합니다.')
        .action((options) => __awaiter(void 0, void 0, void 0, function* () {
        yield mysql_migration_1.default(config, options.table, options.delete, options.force);
    }));
    program.parse(process.argv);
};
fs_1.stat(constants_1.configFilepath, (err) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.argv[2] !== 'init') {
        if (err) {
            return logger_1.printError(`설정파일이 존재하지 않습니다. init 명령어를 먼저 실행해 주세요.`);
        }
        const config = fs_1.readFileSync(constants_1.configFilepath, 'utf-8');
        commander(JSON.parse(config));
    }
    else {
        commander();
    }
}));
//# sourceMappingURL=index.js.map