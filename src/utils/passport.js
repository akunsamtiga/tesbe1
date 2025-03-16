// src/utils/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../utils/prisma");

// Serialize & Deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Strategy untuk Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // Cek apakah user sudah ada
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // Jika belum ada, buat user baru
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              // Untuk user yang login via sosial, password bisa diset sebagai string kosong atau random
              password: "",
              role: "USER",
            },
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
