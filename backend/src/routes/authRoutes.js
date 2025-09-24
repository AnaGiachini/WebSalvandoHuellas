const express = require('express');
const router = express.Router();

// Passport strategies (Google, Facebook)
const passport = require('../configs/passport');
const FRONT_URL = process.env.FRONT_URL || 'http://localhost:3000';

// Controlador
const authController = require('../controllers/authController');

// Validaciones
const { loginValidation, forgotPasswordValidation, resetPasswordValidation } = require('../validations/authValidation');
const { registerValidation } = require('../validations/userValidation');
const { validateRequest } = require('../middlewares/validateRequest');

// Rutas tradicionales
// Registrar un nuevo usuario
router.post('/register', registerValidation, validateRequest, authController.register);
// Iniciar sesión
router.post('/login', loginValidation, validateRequest, authController.login);

// Forgot / Reset password
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);

// Rutas OAuth: Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('[OAuth][Google] Callback error:', err);
      return res.redirect(`${FRONT_URL}/login?error=oauth_google`);
    }
    if (!user) {
      console.warn('[OAuth][Google] No user returned', info);
      return res.redirect(`${FRONT_URL}/login?error=oauth_google_user`);
    }
    req.user = user;
    return authController.socialCallback(req, res);
  })(req, res, next);
});

// Rutas OAuth: Facebook
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${FRONT_URL}/login?error=oauth`, session: false }),
  authController.socialCallback
);

module.exports = router;
