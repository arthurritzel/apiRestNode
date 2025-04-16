import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "Tecnologias Emergentes",
    description: "Documentação da API criada em sala"
  },
  servers: [
    {
      url: "http://localhost:4040",
    }
  ],
  components: {
    schemas: {
      InternalServerError: {
        code: "",
        message: "",
      },
      Product: {
        type: "object",
        required: ["name", "price", "category", "stock"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "Smartphone XYZ" },
          price: { type: "number", minimum: 0, example: 1999.99 },
          category: { type: "string", minLength: 3, maxLength: 50, example: "Electronics" },
          stock: { type: "integer", minimum: 0, example: 100 }
        }
      },
      User: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100, example: "João" },
          email: { type: "string", minimum: 0, example: "example@example.com" },
          password: { type: "string", minLength: 8, maxLength: 20, example: "password123" },
        }
      },
      Order: {
        type: "object",
        required: ["userId", "products"],
        properties: {
          userId: {
            type: "string",
            example: "60f6b2fbc25e4e3d5c1a5f92",
            description: "User ID (MongoDB ObjectId)"
          },
          products: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: {
                  type: "string",
                  example: "60f6b2fbc25e4e3d5c1a5f93",
                  description: "Product ID (MongoDB ObjectId)"
                },
                quantity: {
                  type: "integer",
                  minimum: 1,
                  example: 2,
                  description: "Quantity of the product"
                }
              }
            }
          }
        }
      },
      Debt: {
        type: "object",
        required: ["user", "order", "products", "totalAmount"],
        properties: {
          user: {
            type: "string",
            example: "60f6b2fbc25e4e3d5c1a5f92",
            description: "User ID (MongoDB ObjectId)"
          },
          order: {
            type: "string",
            example: "60f6b2fbc25e4e3d5c1a5f95",
            description: "Order ID (MongoDB ObjectId)"
          },
          products: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["productId", "quantity"],
              properties: {
                productId: {
                  type: "string",
                  example: "60f6b2fbc25e4e3d5c1a5f96",
                  description: "Product ID (MongoDB ObjectId)"
                },
                quantity: {
                  type: "integer",
                  minimum: 1,
                  example: 1,
                  description: "Quantity of the product"
                }
              }
            }
          },
          totalAmount: {
            type: "number",
            minimum: 0,
            example: 199.99,
            description: "Total amount of the debt"
          },
          status: {
            type: "string",
            enum: ["pending", "paid", "overdue"],
            example: "pending",
            description: "Status of the debt"
          }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Insira o token JWT"
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

const outputFile = "./config/swagger.json";
const endpointsFiles = ["./routes.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(async () => {
    await import("./server.js");
  });
