const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Node JS User API",
            version: "1.0",
            description: "A user api with json web token security",
        },
        servers: [
            {
                url: "http://localhost:3001",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./api/routes/router.js"]
};

module.exports = options;