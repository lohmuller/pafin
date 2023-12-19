# Pafin Node.js Project

Welcome to the Pafin Node.js project! This repository contains the source code for the Node.js application using PostgreSQL as the database. For the [Assignment](./pafin_tech_assignment.md)
Follow the steps below to get started.


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
   docker-compose up --build
   ```

   This will build and start the Node.js application and PostgreSQL database containers.

3. Creating the database tables:

   After starting the application, you can create the tables with the following command:

   ```bash
   docker-compose exec pafin_app npm run migrate
   ```

4. Seeding the database:

   After starting the application, you can seed the database with initial data using the following command:

   ```bash
   docker-compose exec pafin_app npm run seed
   ```

   This will run the seeder to create the first user

## Running the test (jest):

   ```bash
   docker-compose exec pafin_app npm run test
   ```

   This will run the seeder to create the first user

## API Endpoints

Here are the main endpoints exposed by the Pafin Node.js API:

### Users

- **Get all users:**
  - `GET /users`

- **Get a specific user by ID:**
  - `GET /users/:id`

- **Create a new user:**
  - `POST /users`
  - Body Parameters:
    - `name` (string): User's name.
    - `email` (string): User's email address.
    - `password` (string): User's password.

- **Update an existing user:**
  - `PUT /users/:id`
  - Body Parameters (optional):
    - `name` (string): Updated user's name.
    - `email` (string): Updated user's email address.
    - `password` (string): Updated user's password.

- **Delete a user:**
  - `DELETE /users/:id`

### Authentication

- **User Login:**
  - `POST /auth/login`
  - Body Parameters:
    - `email` (string): User's email address.
    - `password` (string): User's password.

- If you ran the seed, you can use the following credentials to log in:
  - Email: `admin@pafin.com`
  - Password: `123456`

## Notes

- The application will be accessible at [http://localhost:3000](http://localhost:3000).
- The PostgreSQL database is available at [http://localhost:5432](http://localhost:5432).