const express = require('express');
const passport = require('passport');
const userRoute = require('./user.routes');

const router = express.Router();

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful login, redirect to dashboard or homepage
        res.redirect('/');
    }
);

// Facebook OAuth Routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        // Successful login, redirect to dashboard or homepage
        res.redirect('/');
    }
);

// User routes
router.use('/v1/user', userRoute);

module.exports = router;
