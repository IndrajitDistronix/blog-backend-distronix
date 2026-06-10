# sudo docker compose up --build -d
# docker compose logs -f app

- docker compose exec app npx sequelize db:migrate
sudo docker compose logs -f db
sudo docker compose ps