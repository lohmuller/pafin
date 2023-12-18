# Pafin Node.js Project

Welcome to the Pafin Node.js project! This repository contains the source code for the Node.js application using PostgreSQL as the database. Follow the steps below to get started.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Clone this project

## Setup

1. Create a `.env` file in the project root based on the provided `.env.example` template:

   ```bash
   cp .env.example .env
   ```

   Feel free to modify these configurations according to your needs.

2. Start the application using Docker Compose:

   ```bash
   docker-compose --build up
   ```

   This will build and start the Node.js application and PostgreSQL database containers.


3. Seeding the database:

   After starting the application, you can seed the database with initial data using the following command:

   ```bash
   docker run --rm pafin_app npm run seed
   ```

   This will run a temporarily Node.js container and run the seed to create the first user

## Notes

- The application will be accessible at [http://localhost:3000](http://localhost:3000).
- The PostgreSQL database is available at [http://localhost:5432](http://localhost:5432).
- If you ran the seed, you can use the following credentials to log in:
  - Email: `admin@pafin.com`
  - Password: `123456`


