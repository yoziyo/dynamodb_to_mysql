"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const fs_1 = require("fs");
const constants_1 = require("../util/constants");
describe('config 파일 테스트', () => {
    test('파일 생성', () => {
        config_1.generatorConfigure();
        const configFileRead = fs_1.readFileSync(constants_1.configFilepath, 'utf-8');
        expect(JSON.parse(configFileRead)).toEqual(config_1.defaultConfig);
    });
});
//# sourceMappingURL=config.test.js.map