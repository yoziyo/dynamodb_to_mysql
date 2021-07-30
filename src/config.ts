import { rmSync, writeFileSync } from 'fs';

const filepath = './migration_config.json';

const defaultConfig = {
  AWS_ACCESS_KEY: '',
  AWS_SECRET_KEY: '',
  AWS_REGION: '',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  MYSQL_DATABASE: '',
  MYSQL_PASSWORD: '',
  MYSQL_USER: '',
};

const generatorConfigure = async (): Promise<void> => {
  rmSync(filepath, { recursive: true, force: true });
  return await writeFileSync(
    `${filepath}`,
    JSON.stringify(defaultConfig),
    'utf8',
  );
};

export = generatorConfigure;
