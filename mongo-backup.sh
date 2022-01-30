#! /usr/bin/env zsh

# 0 3 * * * cd ~/repos/cashflow2 && zsh mongo-backup.sh > /tmp/stdout.log 2> /tmp/stderr.log

source .env

export TIMESTAMP=$(date +"%Y-%m-%d")

docker exec -i mongodb /usr/bin/mongodump --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db database --out /cashflow-backup-$TIMESTAMP
docker cp mongodb:/cashflow-backup-$TIMESTAMP ~/mongo-backups

exit
