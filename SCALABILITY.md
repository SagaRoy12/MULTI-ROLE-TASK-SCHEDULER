# Scalability Notes

## Current Architecture

The application follows a monolithic architecture with a clear separation of concerns across Routes, Controllers, Services, and DAO layers. This separation makes it straightforward to migrate individual pieces into independent services when needed.

---

## Microservices

The application can be split into the following independent services:

- Auth Service — handles registration, login, token issuance, and refresh
- User Service — handles profile management
- Task Service — handles all task CRUD operations
- Admin Service — handles admin operations and user management

Each service would have its own database and communicate via REST or a message broker like RabbitMQ.

---

## Caching

Redis can be introduced to cache frequently accessed data such as the list of all users on the admin dashboard. Instead of hitting MongoDB on every request, the result is served from cache and invalidated only when a user is created or deleted. This reduces database load significantly under high traffic.

---

## Load Balancing

Multiple instances of the backend can run behind an Nginx reverse proxy or a cloud load balancer such as AWS ALB. Since JWT authentication is stateless, any instance can handle any request without session sharing.

---

## Database

MongoDB supports horizontal scaling through sharding. The tasks collection can be sharded by user ID so that each shard handles a subset of users, distributing the read and write load evenly.

---

## Rate Limiting

Express rate limiter middleware can be added to public routes such as login and register to prevent brute force attacks and reduce unnecessary server load.