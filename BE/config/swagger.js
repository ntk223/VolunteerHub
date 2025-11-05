import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./environment.js";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho hệ thống BE",
    },
    servers: [
      { url: `http://localhost:${env.APP_PORT}` },
    ],
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
  },
  // glob patterns are resolved from the process cwd when swagger-jsdoc runs.
  // Use ./routes/*.js so when the app is started from the BE folder the files are found.
  apis: ["./routes/*.js", "./routes/**/*.js"], // đường dẫn đến các route có @swagger
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger Docs: http://localhost:${env.APP_PORT}/api-docs`);
};
