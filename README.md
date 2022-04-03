```
docker-compose up -d

python -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
pip3 install -r requirements-dev.txt

# run db workbench
python -i db_workbench.py
```

.env file

```
ENV=dev

FRONTEND_IP=http://localhost:9000

MONGO_URI=
MONGO_INITDB_DATABASE=database
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_IP=172.19.199.3
MONGO_PORT=27017
SECRET_KEY=
```

### Jupiter deploy

- update api/frontend port number?

## docker notes

## Backup

```sh
# generate a backup
$ ./mongo-backup
```

## Restore

```sh
# copy backup to mongodb container
docker cp ~/mongo-backups/cashflow-backup-2022-01-04/database mongodb:/data

# drop database in mongodb container
# log into shell
docker exec -it mongodb /bin/bash
mongo --username admin --password password
> use database
> db.dropDatabase()

# restore from backup
docker exec -i mongodb mongorestore --username admin --password password /data
```
