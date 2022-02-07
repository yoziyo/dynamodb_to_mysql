import generatorConfigure, { defaultConfig } from '../config';
import { readFileSync } from 'fs';
import { configFilepath } from '../util/constants';

describe('config 파일 테스트', () => {
  test('파일 생성', () => {
    generatorConfigure();
    const configFileRead = readFileSync(configFilepath, 'utf-8');
    expect(JSON.parse(configFileRead)).toEqual(defaultConfig);
  });
});
