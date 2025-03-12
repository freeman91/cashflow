
docker-compose down
git pull origin $(git branch --show-current)
echo "Pulled $(git log --oneline | wc -l) line changes"
docker-compose up -d --build

echo "Deployed"
