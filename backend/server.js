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

const corsOptions = {
  origin: "*",
  credentials: false,
};

const PORT = process.env.PORT || 4000;
const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();

app.use(cors(corsOptions));
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

(async function () {
  // starting the apollo server to expose endoint to client
  await apolloServer.start();
  app.use("/graphql", bodyParser.json(), expressMiddleware(apolloServer));
})();

httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
});
