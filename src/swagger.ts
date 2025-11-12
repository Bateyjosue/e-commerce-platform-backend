
import swaggerJsdoc from "swagger-jsdoc";

// Determine the server URL based on the environment
const serverUrl = process.env.NODE_ENV === 'production' 
  ? process.env.RENDER_EXTERNAL_URL 
  : `http://localhost:${process.env.PORT || 3000}`;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce Platform API",
      version: "1.0.0",
      description: "The official API documentation for the E-commerce Platform backend.",
    },
    servers: [
      {
        url: `${serverUrl}/api/v1`,
        description: 'API Server'
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
