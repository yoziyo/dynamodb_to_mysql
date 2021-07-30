"use strict";
var aws_sdk_1 = require("aws-sdk");
var fs_1 = require("fs");
var constants_1 = require("./util/constants");
var logger_1 = require("./util/logger");
var fileIndex = 1;
var client = null;
var filepath = constants_1.exportFilepath;
var params = {
    TableName: '',
};
var getJSON = function (_a, table) {
    var AWS_ACCESS_KEY = _a.AWS_ACCESS_KEY, AWS_SECRET_KEY = _a.AWS_SECRET_KEY, AWS_REGION = _a.AWS_REGION;
    params.TableName = table;
    aws_sdk_1.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION,
    });
    client = new aws_sdk_1.DynamoDB.DocumentClient();
    fs_1.rmSync(filepath, { recursive: true, force: true });
    fs_1.mkdirSync(filepath);
    fs_1.rmSync("" + filepath + table, { recursive: true, force: true });
    fs_1.mkdirSync("" + filepath + table);
    client.scan(params, onScan);
};
var onScan = function (err, data) {
    if (err) {
        logger_1.printError("\uD14C\uC774\uBE14 \uC2A4\uCE94\uC911 \uC5D0\uB7EC\uAC00 \uBC1C\uC0DD \uD558\uC600\uC2B5\uB2C8\uB2E4. \n " + JSON.stringify(err, null, 2));
    }
    else {
        if (fileIndex > 1) {
            logger_1.printLog(params.TableName + " \uCD94\uAC00 Scan \uC644\uB8CC");
        }
        else {
            logger_1.printLog(params.TableName + " Scan \uC644\uB8CC");
        }
        var filename_1 = params.TableName + "_" + fileIndex + ".json";
        fs_1.writeFile("" + filepath + params.TableName + "/" + filename_1, JSON.stringify(data.Items), 'utf8', function (err) {
            if (err)
                throw err;
            logger_1.printLog(params.TableName + " \uD30C\uC77C \uC0DD\uC131 \uC644\uB8CC (" + filename_1 + ")");
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