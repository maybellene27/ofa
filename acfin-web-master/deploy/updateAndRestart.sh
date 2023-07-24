#!/bin/bash

# any future command that fails will exit the script
set -e

cd ~/acfin-web
sudo git stash
sudo git pull
sudo rm package-lock.json
sudo npm install
sudo pm2 restart acfin-web --update-env