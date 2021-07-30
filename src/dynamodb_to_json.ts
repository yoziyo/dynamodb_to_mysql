import { AWSError, config, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { rmSync, mkdirSync, writeFile } from 'fs';

import { Config } from './index';
import { exportFilepath } from './util/constants';
import { printError, printLog } from './util/logger';

let fileIndex = 1;
let client = null as DocumentClient;
const filepath = exportFilepath;
const params: DocumentClient.ScanInput = {
  TableName: '',
};

const getJSON = (
  { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION }: Config,
  table: string,
): void => {
  params.TableName = table;

  config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });

  client = new DynamoDB.DocumentClient();

  rmSync(filepath, { recursive: true, force: true });
  mkdirSync(filepath);
  rmSync(`${filepath}${table}`, { recursive: true, force: true });
  mkdirSync(`${filepath}${table}`);
  client.scan(params, onScan);
};

const onScan = (err: AWSError, data: DocumentClient.ScanOutput) => {
  if (err) {
    printError(
      `테이블 스캔중 에러가 발생 하였습니다. \n ${JSON.stringify(
        err,
        null,
        2,
      )}`,
    );
  } else {
    if (fileIndex > 1) {
      printLog(`${params.TableName} 추가 Scan 완료`);
    } else {
      printLog(`${params.TableName} Scan 완료`);
    }

    const filename = `${params.TableName}_${fileIndex}.json`;

    writeFile(
      `${filepath}${params.TableName}/${filename}`,
      JSON.stringify(data.Items),
      'utf8',
      (err) => {
        if (err) throw err;

        printLog(`${params.TableName} 파일 생성 완료 (${filename})`);
        fileIndex++;

        // 추가 데이터 있을경우 계속 스캔
        if (typeof data.LastEvaluatedKey != 'undefined') {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          client.scan(params, onScan);
        }
      },
    );
  }
};

export = getJSON;
