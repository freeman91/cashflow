#! /usr/bin/env zsh

source .env

docker cp ${<backup dir>} mongodb:/data

docker exec -i mongodb mongorestore /data/${backup dir}

exit
