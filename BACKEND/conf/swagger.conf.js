// src/config/swagger.config.js
import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Role Task Management API",
      version: "1.0.0",
      description: "REST API with Authentication and Role-Based Access Control",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@gmail.com" },
            password: { type: "string", example: "password123" },
          },
        },
        Task: {
          type: "object",
          properties: {
            title: { type: "string", example: "My first task" },
            description: { type: "string", example: "Task description" },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "completed"],
              example: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              example: "medium",
            },
          },
        },
      },
    },
  },
  apis: [join(__dirname, "../routes/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);