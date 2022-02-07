"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var constants_1 = require("./util/constants");
var defaultConfig = {
    AWS_ACCESS_KEY: '',
    AWS_SECRET_KEY: '',
    AWS_REGION: '',
    MYSQL_HOST: 'localhost',
    MYSQL_PORT: '3306',
    MYSQL_DATABASE: '',
    MYSQL_PASSWORD: '',
    MYSQL_USER: '',
};
var generatorConfigure = function () {
    fs_1.rmSync(constants_1.configFilepath, { recursive: true, force: true });
    fs_1.writeFileSync("" + constants_1.configFilepath, JSON.stringify(defaultConfig), 'utf8');
};
exports.default = generatorConfigure;
//# sourceMappingURL=config.js.map