"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDynamoDB = void 0;
const aws_sdk_1 = require("aws-sdk");
const fs_1 = require("fs");
const constants_1 = require("./util/constants");
const logger_1 = require("./util/logger");
const state = {
    fileIndex: 1,
    documentClient: null,
    filepath: constants_1.exportFilepath,
    tableParams: {
        TableName: '',
    },
};
const onScan = (err, data) => {
    try {
        if (err)
            throw new Error(`테이블 스캔중 에러가 발생 하였습니다. \n ${JSON.stringify(err, null, 2)}`);
        logger_1.printLog(`${state.tableParams.TableName} ${state.fileIndex > 1 ? '추가 ' : ''}Scan 완료`);
        writeFile(data);
    }
    catch (e) {
        logger_1.printError(e);
    }
};
const writeFile = (data) => {
    try {
        const filename = `${state.tableParams.TableName}_${state.fileIndex}.json`;
        fs_1.writeFileSync(`${state.filepath}${state.tableParams.TableName}/${filename}`, JSON.stringify(data.Items), 'utf8');
        logger_1.printLog(`${state.tableParams.TableName} 파일 생성 완료 (${filename})`);
        state.fileIndex++;
        // 추가 데이터 있을 경우 계속 스캔
        if (typeof data.LastEvaluatedKey != 'undefined') {
            state.tableParams.ExclusiveStartKey = data.LastEvaluatedKey;
            state.documentClient.scan(state.tableParams, onScan);
        }
    }
    catch (writeError) {
        logger_1.printError(`파일 생성 중 에러가 발생 하였습니다. \n ${JSON.stringify(writeError, null, 2)}`);
    }
};
const exportDynamoDB = ({ AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION }, table) => {
    state.tableParams.TableName = table;
    aws_sdk_1.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: AWS_REGION,
    });
    state.documentClient = new aws_sdk_1.DynamoDB.DocumentClient();
    // 기존에 받아진 데이터를 모두 제거하고 진행
    fs_1.rmSync(`${state.filepath}${table}`, { recursive: true, force: true });
    fs_1.mkdirSync(`${state.filepath}${table}`);
    state.documentClient.scan(state.tableParams, onScan);
};
exports.exportDynamoDB = exportDynamoDB;
//# sourceMappingURL=exports.js.map