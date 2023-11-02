const typeDefs = `
    type User {
        email: String!
        password: String!
    }

    type ApiResponse {
        statusCode: Int!,
        message: String!,
    }

    type Question {
        question: String!,
        ans: String!
        options: [String!]!
    }

    type Questions {
        category: String!
        questions: [Question!]!
    }

    type Query {
        users: [User!]
        questions: [Questions!]!
    }

    type Mutation {
        signup(email: String!, password: String!): User!
        login(email: String!, password: String!): ApiResponse!
    }
`;

export default typeDefs;
