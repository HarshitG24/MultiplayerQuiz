import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import bodyParser from "body-parser";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import typeDefs from "./schema/typedef.js";
import resolvers from "./schema/resolver.js";
import indexRouter from "./routes/index.js";
import passport from "passport";
import "./auth/auth.js";

const PORT = process.env.PORT || 4000;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();

const corsOptions = {
  origin: "*", // Replace with your frontend's URL
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("/google/callback", cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

// creating server instance
const httpServer = createServer(app);

// initializing websocket server
// as subscriptions make use of websockets to communicate
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const wsServerCleanup = useServer({ schema }, wsServer);

// creating apollo server with schema and server instance
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

await apolloServer.start();

app.use(
  "/",
  cors(),
  bodyParser.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req, res }) => {
      return {
        req,
        res,
      };
    },
  })
);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// // app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

// app.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth/failure",
//     successRedirect: "/protected",
//   })
// );

// app.get("/auth/failure", (req, res) => {
//   res.send("something went wrong");
// });

// app.get("/protected", isLoggedIn, (req, res) => {
//   console.log("the request is: ", req.user.emails);
//   res.send(`Hello ${req.user.emails[0].value}`);
// });

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong");
});

app.get("/protected", isLoggedIn, (req, res) => {
  console.log("the request is: ", req.user.emails);
  // res.send(`Hello ${req.user.emails[0].value}`);
});

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
