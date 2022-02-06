"use strict";
var fs_1 = require("fs");
var filepath = './migration_config.json';
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
    fs_1.rmSync(filepath, { recursive: true, force: true });
    return fs_1.writeFileSync("" + filepath, JSON.stringify(defaultConfig), 'utf8');
};
module.exports = generatorConfigure;
//# sourceMappingURL=config.js.map