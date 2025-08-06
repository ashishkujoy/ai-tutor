
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails![0].value });

        if (user) {
          return done(null, user);
        }

        const error = new Error(`User ${profile.emails![0].value} not found`);
        return done(error, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await User.findOne({ email });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;
