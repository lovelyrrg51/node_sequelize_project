# Node Sequelize Backend Project

Backend for the Sim Web App

### Setup
Install nodejs and mysql.


Install pm2:
```
sudo npm install -g pm2
```

Set the following variables in a file called `.env` at the project root:
```
MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MAILGUN_PUBLIC=
MAILGUN_PRIVATE=
FRONTEND_BASE_URL=
```

Start the server:
```
npm start
```
