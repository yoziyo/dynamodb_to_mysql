# DynamoDB to Mysql

## Description

dynamodb scan -> csv 변환 -> mysql insert 하는 툴 입니다.

순수 nosql => rdb로의 마이그레이션을 위해서 만들어 져서 모든 데이터는 mysql에서 가공한다는 가정으로 만들어 졌습니다.

그 예로 모든데이터는 TEXT로 insert 되며, nosql 데이터에 object나 array가 있을수 있으므로 그에 대한 후처리 진행 후 TEXT로 삽입하며, int형도 따로 분리하지 않고 모두 TEXT 타입으로 삽입 됩니다.

빈 데이터는 null로 들어가므로 필요시 mysql 에서 컬럼의 타입을 변경 후, 재가공해서 사용하면 됩니다.

mysql은 load data를 사용하므로, 해당 기능이 제공되는 환경이여야 합니다.

## How to

```
npm run build
node build/index.js init
```
init 구문을 먼저 실행 후, migration_config.json 을 채워 줍니다.

```
node build/index.js export -t <TABLE>
node build/index.js convert -t <TABLE>
node build/index.js migration -t <TABLE>
```

각각 필요에 따라 명령어를 사용하여 줍니다.

이때 추가 옵션 및 상세한 설명은 `--help` 에서 확인 가능 합니다.