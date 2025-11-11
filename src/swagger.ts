import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-Commerce application.',
    },
    servers: [
      {
        url: 'https://3000-firebase-e-commerce-backend-1762700238265.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev/api/v1/', // Update with your actual server URL
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', format: 'email', description: 'User email' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            description: { type: 'string' },
            category: { type: 'string' },
            stock: { type: 'number' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            totalPrice: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'paid', 'delivered', 'canceled'] },
            description: { type: 'string' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'number' },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            Success: { type: 'boolean', example: false },
            Message: { type: 'string' },
            Object: { type: 'object', nullable: true, example: null },
            Errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the files containing OpenAPI annotations
};

export const swaggerSpec = swaggerJsdoc(options);
