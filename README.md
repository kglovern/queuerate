# Curator App
git pull
cd client
yarn install
yarn build
cd
sudo mv curator/client/dist/* /var/www/html/
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart curator.service
sudo systemctl restart celery.service