import express from "express";
import jwt from "express-jwt";
import mongoose from "mongoose";

import { ApolloServer } from "apollo-server-express";

import { graphqlUploadExpress } from "graphql-upload";

import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";

import { setDefaultAdmin } from "./config/initialSetup";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const startServer = async () => {
  setDefaultAdmin();

  const app = express();

  const auth = jwt({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ["HS256"],
  });

  app.use(auth);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    playground: {
      endpoint: "/graphql",
    },
    context: ({ req }) => {
      const user = req.headers.user
        ? JSON.parse(req.headers.user)
        : req.user
        ? req.user
        : null;
      return { user };
    },
  });

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await mongoose.connect(
    `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );

  app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(err.status).send({ message: "Invalid Token... " });
      return;
    }

    next();
  });

  app.listen({ port: process.env.SERVER_PORT }, () =>
    console.log(
      `[INFO] Server ready at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`
    )
  );
};

startServer();