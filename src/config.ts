import { rmSync, writeFileSync } from 'fs';
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

export const defaultConfig: Config = {
  AWS_ACCESS_KEY: '',
  AWS_SECRET_KEY: '',
  AWS_REGION: '',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  MYSQL_DATABASE: '',
  MYSQL_PASSWORD: '',
  MYSQL_USER: '',
};

const generatorConfigure = (): void => {
  rmSync(configFilepath, { recursive: true, force: true });
  writeFileSync(`${configFilepath}`, JSON.stringify(defaultConfig), 'utf8');
};

export default generatorConfigure;
