import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LLM API',
      version: '1.0.0',
      description: 'API para integração com múltiplos provedores de LLM',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Não autorizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        BadRequestError: {
          description: 'Entrada inválida',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Erro interno',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
    parameters: {
      SignatureHeader: {
        name: 'x-signature',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Assinatura digital gerada pelo cliente',
      },
      TimestampHeader: {
        name: 'x-timestamp',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Timestamp da requisição no formato ISO 8601',
      },
      ApiKeyHeader: {
        name: 'x-api-key',
        in: 'header',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Chave da API para autenticação',
      },
    },
  },
  apis: ['./src/controllers/*.ts', './src/dtos/*.ts'],
});
