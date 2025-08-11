
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed` }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send();
    }
    res.redirect(`${process.env.FRONTEND_URL}/`);
  });
});

// Add route to check authentication status
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
