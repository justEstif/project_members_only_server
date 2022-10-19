import express, { urlencoded, json } from "express";
import passport from "passport";
import { anonStrategy, jwtStrategy, localStrategy } from "./config/passport";
import router from "./routes";

const app = express();

// body parser
app.use(json());
app.use(urlencoded({ extended: false }));

// passport
passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(anonStrategy);

app.use(passport.initialize());
app.use("/api", router);

// TODO add error handler middleware

export default app;
