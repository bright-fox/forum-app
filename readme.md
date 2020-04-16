# Forum App

Follow the steps below to start the app.

## API Server

1. You need MongoDB to run the server
  * The following steps show how to use a local setup and you can choose either one of these
  * Download MongoDB [via the official download center](https://www.mongodb.com/download-center/community) and run `mongod` in the CLI
  * Via Docker (*preferred way*):  Download the official docker image and run an instance of MongoDB as a container

```console
docker pull mongo
docker run -d -p 27017:27017 --name mongodb mongo
```

1. Navigate to the *apiserver* folder
1. Install all the dependencies

```console
npm install 
````

1. Rename the directory *config-example* to *config* and edit the configurations for the MongoDB connection to match your setup.
1. Rename the file *.env.example* to *.env* and use your secret keys. *Never share those keys with anyone!*
1. Seed the database with example data

```console
npm run seed 
````

1. Start the API server

```console
npm start
```

## Client

1. Install all the dependencies

```console
npm install 
````

1. Start the app

```console
npm start
```