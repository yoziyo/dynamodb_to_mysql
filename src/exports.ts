import { AWSError, config as awsConfig, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { rmSync, mkdirSync, writeFileSync } from 'fs';
import { Config } from './config';
import { exportFilepath } from './util/constants';
import { printError, printLog } from './util/logger';

const state: {
  fileIndex: number;
  documentClient: DocumentClient;
  filepath: string;
  tableParams: DocumentClient.ScanInput;
} = {
  fileIndex: 1,
  documentClient: null,
  filepath: exportFilepath,
  tableParams: {
    TableName: '',
  },
};

const onScan = (err: AWSError, data: DocumentClient.ScanOutput) => {
  try {
    if (err)
      throw new Error(
        `테이블 스캔중 에러가 발생 하였습니다. \n ${JSON.stringify(
          err,
          null,
          2,
        )}`,
      );

    printLog(
      `${state.tableParams.TableName} ${
        state.fileIndex > 1 ? '추가 ' : ''
      }Scan 완료`,
    );
    writeFile(data);
  } catch (e) {
    printError(e);
  }
};

const writeFile = (data: DocumentClient.ScanOutput) => {
  try {
    const filename = `${state.tableParams.TableName}_${state.fileIndex}.json`;

    writeFileSync(
      `${state.filepath}${state.tableParams.TableName}/${filename}`,
      JSON.stringify(data.Items),
      'utf8',
    );

    printLog(`${state.tableParams.TableName} 파일 생성 완료 (${filename})`);
    state.fileIndex++;

    // 추가 데이터 있을 경우 계속 스캔
    if (typeof data.LastEvaluatedKey != 'undefined') {
      state.tableParams.ExclusiveStartKey = data.LastEvaluatedKey;
      state.documentClient.scan(state.tableParams, onScan);
    }
  } catch (writeError) {
    printError(
      `파일 생성 중 에러가 발생 하였습니다. \n ${JSON.stringify(
        writeError,
        null,
        2,
      )}`,
    );
  }
};

export const exportDynamoDB = (
  { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION }: Config,
  table: string,
): void => {
  state.tableParams.TableName = table;

  awsConfig.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });

  state.documentClient = new DynamoDB.DocumentClient();

  // 기존에 받아진 데이터를 모두 제거하고 진행
  rmSync(`${state.filepath}${table}`, { recursive: true, force: true });
  mkdirSync(`${state.filepath}${table}`);

  state.documentClient.scan(state.tableParams, onScan);
};
