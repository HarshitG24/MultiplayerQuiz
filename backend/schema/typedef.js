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

    type QnA {
        question: String!
        answer: String!
    }

    type Answer {
        user1Score: Int!
        user2Score: Int!
        user1Ans: [QnA!]
        user2Ans: [QnA!]
    }

    type QuizData {
        category: String!
        questions: [Question!]!
    }

    type AuthResponse {
        accessToken:String!
        refreshToken: String!
        email: String!
    }

    type CategoryData {
        category: String!
        imageUrl: String!
        description: String!
    }

    type Query {
        users: [User!]
        questions: [Questions!]!
        fetchCategories: [CategoryData!]
        fetchQuizData(code: Int!): QuizData!
        getUsers(code: Int!): [String!]!
    }

    type Mutation {
        signup(email: String!, password: String!, confirmPassword: String!): ApiResponse!
        login(email: String!, password: String!): ApiResponse!
        startGame(email: String!, category: String!, code: Int!): Game!
        joinGame(code: Int!, email: String!): Game!
        addAnswer(code: Int!, user: String!, answer: String!, score: Int!, question: Int!): Answer!
        signUpGoogle(accessToken: String!): AuthResponse
        verifyJWT(token: String!): ApiResponse!
    }

    type Subscription {
        gameOn(code: Int!): Game!
        optionSelected(code: Int!): Answer!
    }
`;

export default typeDefs;
