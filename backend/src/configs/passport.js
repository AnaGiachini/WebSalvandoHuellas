const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Usuario = require('../models/usuario');

const {
  FRONT_URL = 'http://localhost:3000',
  BACK_URL = 'http://localhost:4000',
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = process.env;

function splitName(displayName = '') {
  const parts = (displayName || '').trim().split(/\s+/);
  const nombre = parts[0] || 'Usuario';
  const apellido = parts.slice(1).join(' ') || 'Social';
  return { nombre, apellido };
}

passport.serializeUser((user, done) => done(null, user.idUsuario));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findByPk(id);
    done(null, user);
  } catch (e) { done(e); }
});

// Registrar GoogleStrategy solo si hay credenciales
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACK_URL}/api/v1/auth/google/callback`,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0]?.value;
      if (!email) {
        console.error('[OAuth][Google] No email in profile', { profile: { id: profile.id, displayName: profile.displayName, emails: profile.emails } });
        return done(new Error('No pudimos obtener el email de Google'));
      }

      let user = await Usuario.findOne({ where: { email } });
      if (!user) {
        const { nombre, apellido } = splitName(profile.displayName);
        user = await Usuario.create({ nombre, apellido, email, contrasena: 'oauth_google', rol: 'user' });
      }
      done(null, user);
    } catch (err) {
      console.error('[OAuth][Google] Strategy error:', err);
      done(err);
    }
  }));
} else {
  console.warn('[OAuth] Google deshabilitado: faltan GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET en .env');
}

// Registrar FacebookStrategy solo si hay credenciales
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${BACK_URL}/api/v1/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails'],
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0]?.value;
      if (!email) return done(new Error('No pudimos obtener el email de Facebook'));

      let user = await Usuario.findOne({ where: { email } });
      if (!user) {
        const { nombre, apellido } = splitName(profile.displayName);
        user = await Usuario.create({ nombre, apellido, email, contrasena: 'oauth_facebook', rol: 'user' });
      }
      done(null, user);
    } catch (err) { done(err); }
  }));
} else {
  console.warn('[OAuth] Facebook deshabilitado: faltan FACEBOOK_APP_ID/FACEBOOK_APP_SECRET en .env');
}

module.exports = passport;
