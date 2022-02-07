import { Command } from 'commander';
import { stat, readFileSync } from 'fs';
import { generatorConfigure, Config } from './config';
import converter from './convert_csv';
import migration from './mysql_migration';
import { printError, printLog } from './util/logger';
import { configFilepath } from './util/constants';
import { exportDynamoDB } from './exports';

const program = new Command();

const commander = (config?: Config) => {
  program
    .command('init')
    .description('설정 파일을 재생성 합니다.')
    .action(() => {
      try {
        generatorConfigure();
        printLog(
          "설정파일 생성 완료. config.json 파일을 수정한 뒤 '--help' 를 입력하여 진행 하여 주세요!",
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
      exportDynamoDB(config, options.table);
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
      converter(options.table, options.delete);
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
    .action(
      async (options: { table: string; delete?: boolean; force?: boolean }) => {
        await migration(config, options.table, options.delete, options.force);
      },
    );

  program.parse(process.argv);
};

stat(configFilepath, async (err) => {
  if (process.argv[2] !== 'init') {
    if (err) {
      return printError(
        `설정파일이 존재하지 않습니다. init 명령어를 먼저 실행해 주세요.`,
      );
    }

    const config = readFileSync(configFilepath, 'utf-8');

    commander(JSON.parse(config));
  } else {
    commander();
  }
});
