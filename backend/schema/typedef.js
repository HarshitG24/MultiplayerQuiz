const typeDefs = `
    type User {
        email: String!
        password: String!
    }

    type ApiResponse {
        statusCode: Int!,
        message: String!,
    }

    type Game {
        code: Int!,
        users: [String!]!,
        category: String!
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

    type Answer {
        question: Int!
        answer: String!
    }

    type QuizData {
        category: String!
        questions: [Question!]!
    }

    type Query {
        users: [User!]
        questions: [Questions!]!
        fetchQuizData(code: Int!): QuizData!
    }

    type Mutation {
        signup(email: String!, password: String!): User!
        login(email: String!, password: String!): ApiResponse!
        startGame(email: String!, category: String!, code: Int!): Game!
        joinGame(code: Int!, email: String!): Game!
        addAnswer(code: Int!, user: String!, answer: String!, score: Int!, question: Int!): ApiResponse!
    }

    type Subscription {
        gameOn(code: Int!): Game!
    }
`;

export default typeDefs;
