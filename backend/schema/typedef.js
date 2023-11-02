const typeDefs = `
    type User {
        email: String!
        password: String!
    }

    type ApiResponse {
        statusCode: Int!,
        message: String!,
    }

    type Query {
        users: [User!]
    }

    type Mutation {
        signup(email: String!, password: String!): User!
        login(email: String!, password: String!): ApiResponse!
    }
`;

export default typeDefs;
