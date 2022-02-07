"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorConfigure = exports.defaultConfig = void 0;
const fs_1 = require("fs");
const constants_1 = require("./util/constants");
exports.defaultConfig = {
    AWS_ACCESS_KEY: '',
    AWS_SECRET_KEY: '',
    AWS_REGION: '',
    MYSQL_HOST: 'localhost',
    MYSQL_PORT: '3306',
    MYSQL_DATABASE: '',
    MYSQL_PASSWORD: '',
    MYSQL_USER: '',
};
const generatorConfigure = () => {
    fs_1.rmSync(constants_1.configFilepath, { recursive: true, force: true });
    fs_1.writeFileSync(`${constants_1.configFilepath}`, JSON.stringify(exports.defaultConfig), 'utf8');
};
exports.generatorConfigure = generatorConfigure;
//# sourceMappingURL=config.js.map