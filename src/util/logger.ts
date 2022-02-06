import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import chalk from 'chalk';

const getTime = () => dayjs().locale('ko').format('YYYY-MM-DD HH:mm:ss');
const printLog = (log: string): void => {
  console.info(chalk.bgBlackBright(`${getTime()}`), log);
};

const printError = (log: string): void => {
  console.error(chalk.bgRedBright(`${getTime()}`), chalk.bold.red(log));
};

export { printLog, printError };
