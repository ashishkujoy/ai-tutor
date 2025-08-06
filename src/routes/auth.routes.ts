
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send();
    }
    res.redirect('/');
  });
});

export default router;
