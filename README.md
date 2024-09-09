# node-mongo-registration-login-api

NodeJS + MongoDB API for User Management, Authentication and Registration

## Follow steps in order to deploy on AWS
sudo rm -r ebook 

sudo rm -r book-backend

git clone git@github.com:Manjeet-Nandal/book-backend.git

cd book-backend && npm i

pscp -i ebook.ppk -r "C:\Users\Manjeet Nandal\OneDrive\Desktop\book\book-frontend\dist\ebook" ubuntu@ec2-18-222-42-123.us-east-2.compute.amazonaws.com:/home/ubuntu/

sudo pm2 reload all

sudo service nginx restart

sudo systemctl restart nginx

sudo nginx -t

sudo tail -f /var/log/nginx/error.log

sudo nano /etc/nginx/sites-enabled/ExperiyaElite

server {

    listen 80;

    server_name 18.222.42.123;

location /api/ {

    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_set_header Host $host;

    proxy_pass http://127.0.0.1:4000/;

    proxy_http_version 1.1;

    proxy_set_header Upgrade $http_upgrade;

    proxy_set_header Connection "upgrade";

}

    location / {

        root /home/ubuntu/ebook;
    
        try_files $uri $uri/ /index.html;

    }

}