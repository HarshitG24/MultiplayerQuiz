import passport from "passport";
// import strategy from "passport-google-oauth20";
import { Strategy } from "passport-google-token";
import dotenv from "dotenv";
dotenv.config();

// const GoogleStrategy = strategy.Strategy;

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

passport.authenticate("google", {
  failureRedirect: "/auth/failure",
  successRedirect: "/protected",
});

export const authenticateGoogle = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "google-token",
      { session: false },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });
