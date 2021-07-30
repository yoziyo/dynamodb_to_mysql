import { Command } from 'commander';
import { stat, readFileSync } from 'fs';
import generatorConfigure from './config';
import converter from './convert_csv';
import getJSON from './dynamodb_to_json';
import migration from './mysql_migration';
import { printError, printLog } from './util/logger';
import { configFilepath } from './util/constants';

export type Config = {
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_REGION: string;
  MYSQL_HOST: string;
  MYSQL_PORT: string;
  MYSQL_DATABASE: string;
  MYSQL_PASSWORD: string;
  MYSQL_USER: string;
};

const program = new Command();

const commander = (config: Config) => {
  program
    .command('init')
    .description('설정 파일을 생성합니다.')
    .action(async () => {
      try {
        await generatorConfigure();
        printLog(
          "설정파일 생성 완료. migration_config.json 파일을 수정한 뒤 '--help' 를 입력하여 진행 하여 주세요!",
        );
      } catch (err) {
        printError(`설정파일 생성 실패 ${err}`);
      }
    });

  program
    .command('export')
    .description('dynamodb 데이터를 json 으로 추출 합니다.')
    .requiredOption('-t, --table <table>', 'dynamodb table 이름을 입력합니다.')
    .action((options: { table: string }) => {
      getJSON(config, options.table);
    });

  program
    .command('convert')
    .description('추출된 데이터를 csv로 변환 합니다.')
    .requiredOption(
      '-t, --table <table>',
      '변환할 dynamodb table을 입력합니다. (export/{table})',
    )
    .option('-d, --delete', 'csv 파일 생성 후 json 파일을 모두 삭제 합니다.')
    .action((options: { table: string; delete?: boolean }) => {
      converter(options.table, options.delete ? true : false);
    });

  program
    .command('migration')
    .description('csv로 추출된 데이터를 mysql에 bulk insert 합니다.')
    .requiredOption(
      '-t, --table <table>',
      '추출 된 dynamodb table을 입력 합니다.',
    )
    .option('-f, --force', '생성된 테이블이 있다면 제거하고 진행합니다.')
    .option('-d, --delete', 'migration 후 데이터를 삭제합니다.')
    .action((options: { table: string; delete?: boolean; force?: boolean }) => {
      migration(
        config,
        options.table,
        options.delete ? true : false,
        options.force ? true : false,
      );
    });

  program.parse(process.argv);
};

stat(configFilepath, async (err) => {
  if (err) {
    return printError(
      `설정파일이 존재하지 않습니다. init 명령어를 먼저 실행해 주세요.`,
    );
  }

  const config = await readFileSync(configFilepath, 'utf-8');

  commander(JSON.parse(config));
});
