import generatorConfigure from '../config';
import { readFileSync, stat } from 'fs';
import { configFilepath } from '../util/constants';
import Config from '../config';

test('config 파일 생성 테스트', () => {
  generatorConfigure();
  stat(configFilepath, (err) => {
    if (err) {
      throw Error();
    }

    const config = readFileSync(configFilepath, 'utf-8');
    expect(config).toEqual(Config);
  });
});
