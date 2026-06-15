# build and start container
- sudo docker compose up --build -d 
#           or 
sudo docker compose up -d

# see logs of containers
- docker compose logs -f app
- sudo docker compose logs -f db

# to stop a container
- sudo docker compose down
# to delete volume
- sudo docker compose down -v

# execute command inside a running container
- docker compose exec app npx sequelize db:migrate

# list running containers
- sudo docker compose ps