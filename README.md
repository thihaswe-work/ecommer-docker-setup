# Ecommerce

#### Video Demo: <URL HERE>

#### CS50 Final Project – E-Commerce Platform

For my CS50 Final Project, I created a full e-commerce application consisting of a public storefront, an admin dashboard, and a backend API, all working together in a containerized environment.

The public site is built with Next.js, providing a fast and modern shopping experience with server-side rendering and smooth navigation. The admin dashboard is developed using React, allowing administrators to manage products, categories, and orders through an easy-to-use interface.

The backend is powered by NestJS, where I structured the API using modules, controllers, and services. Data is stored in a MySQL database with properly defined tables and relationships.

To make the project simple to run and set up, I used Docker to containerize all services—frontend, backend, and database—so the whole system can be started with a single command.

During development, I wrote much of the code myself, especially the API logic, database structure, and UI components. I also used AI assistance for some parts, such as generating boilerplate code and writing the initial Docker configuration, which I then customized and configured to fit the project.

Overall, this project demonstrates my ability to build a full-stack, multi-service application using modern web technologies, while also effectively using tools like Docker and AI to improve development speed and reliability.

### Key features

- Public storefront (Next.js): product listing, product detail pages, search, simple cart flow.

- Admin dashboard (React): CRUD for products, categories, orders, and basic user management.

- Backend API (NestJS): REST endpoints for products, categories, users, orders; authentication basics.

- MySQL database with schema migrations and optional seed data.

- Dockerized development environment for consistent, reproducible setup.

- Honest use of AI: I wrote the majority of the core logic and UI; I used AI to generate boilerplate and to help craft Dockerfiles and initial configuration which I reviewed and adapted.

### Tech stack

- Frontend (public): Next.js

- Admin frontend: React (Vite )

- Backend API: NestJS (TypeScript, modular controllers/services)

- Database: MySQL

- Containers: Docker, docker-compose

- Other tools: TypeORM, ESLint, Prettier

<h1 style="color:red;font:bold">⚠️ Important</h1>

> **_Your localhost need to be free at port:_**
>
> - 3000(fontend_public)
> - 5173(frontend_admin)
> - 5000(backend)
> - 3306(mysql)

## To Run The Project.

### 1.First

```bash
docker-compose build
```

### 2.Seed

```bash
docker-compose run --rm backend npm run seed
```

### 3.Run

```bash
docker-compose up
```

Ecommerce Webiste will be opened at [http://localhost:3000](http://localhost:3000)
</br>
The admin Dashboard will be opened at [http://localhost:5173](http://localhost:5173)

> UserName & Password For Admin Site
>
> **email**: `admin@cs50.com`</br>
> **password**: `admin123`

> UserName & Password For Public Site
>
> **email**: `user1@example.com`</br>
> **password**: `password`
