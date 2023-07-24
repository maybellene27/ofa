#!/bin/bash

# any future command that fails will exit the script
set -e

sudo docker login repo.maroonstudios.com:5050 -u imagepull -p $PASS
sudo docker stop acfin-web
sudo docker rm acfin-web
sudo docker system prune -a -f
sudo docker pull $IMAGE
sudo docker run --restart unless-stopped -p 3000:3000 --name acfin-web -d $IMAGE
