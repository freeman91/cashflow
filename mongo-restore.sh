#! /usr/bin/env zsh

# Drop and restore database from a backup

source .env

filename="cashflow-backup-$(date +"%Y-%m-%d")"

docker cp ~/mongo-backups/$BACKUP_DB_DIR mongodb:/data

docker exec -i mongodb /usr/bin/mongorestore --port 27017 --username $MONGO_INITDB_ROOT_USERNAME --password $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --db database /$filename/database --drop

exit
