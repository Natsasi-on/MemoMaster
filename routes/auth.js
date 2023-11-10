const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

//copy from https://www.passportjs.org/packages/passport-google-oauth20/
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            //we use profile to create object
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profileImage: profile.photos[0].value,
            };

            try {
                //check login info if it found in the database
                //if not found >> create new user and login
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (error) {
                console.log(error);
            }
        }
    )
);


//crate route
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
        successRedirect: "/dashboard",
    })
);

// Route if something goes wrong
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});




// Presist user data after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Retrieve user data from session.
// Original Code
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// New
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Destroy user session 
// when go to /logout do this
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
});


module.exports = router;
