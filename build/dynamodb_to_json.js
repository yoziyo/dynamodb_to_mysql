"use strict";
const aws_sdk_1 = require("aws-sdk");
const fs_1 = require("fs");
const constants_1 = require("./util/constants");
const logger_1 = require("./util/logger");
let fileIndex = 1;
let client = null;
const filepath = constants_1.exportFilepath;
const params = {
    TableName: '',
};
const getJSON = ({ AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION }, table) => {
    params.TableName = table;
    aws_sdk_1.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION,
    });
    client = new aws_sdk_1.DynamoDB.DocumentClient();
    fs_1.rmSync(filepath, { recursive: true, force: true });
    fs_1.mkdirSync(filepath);
    fs_1.rmSync(`${filepath}${table}`, { recursive: true, force: true });
    fs_1.mkdirSync(`${filepath}${table}`);
    client.scan(params, onScan);
};
const onScan = (err, data) => {
    if (err) {
        logger_1.printError(`테이블 스캔중 에러가 발생 하였습니다. \n ${JSON.stringify(err, null, 2)}`);
    }
    else {
        if (fileIndex > 1) {
            logger_1.printLog(`${params.TableName} 추가 Scan 완료`);
        }
        else {
            logger_1.printLog(`${params.TableName} Scan 완료`);
        }
        const filename = `${params.TableName}_${fileIndex}.json`;
        fs_1.writeFile(`${filepath}${params.TableName}/${filename}`, JSON.stringify(data.Items), 'utf8', (err) => {
            if (err)
                throw err;
            logger_1.printLog(`${params.TableName} 파일 생성 완료 (${filename})`);
            fileIndex++;
            // 추가 데이터 있을경우 계속 스캔
            if (typeof data.LastEvaluatedKey != 'undefined') {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                client.scan(params, onScan);
            }
        });
    }
};
module.exports = getJSON;
//# sourceMappingURL=dynamodb_to_json.js.map