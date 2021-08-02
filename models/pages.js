// File dependencies
const express = require('express');
const router = express.Router();
const db = require('./db');
const appUtils = require('./appUtils');

// Homepage & Login
router.get("/", (request, response) => {
    if (appUtils.checkCookie(request) && request.session.loggedin) {
        appUtils.extendCookie(request);
        appUtils.setCookieURL(request);
        response.status(200); // 200 is OK 
        response.render("pages/index", {
            data: request.session,
            page_name: 'home',
            activeUser: {
                username: request.session.username,
                userLevel: request.session.userLevel
            }
        });
    } else {
        response.status(200); // 200 is OK 
        response.render("pages/login");
    }
});


// Logoff
router.get("/logoff", (request, response) => {
    request.session.destroy();
    response.redirect("/");
})

// Manage users (admin only)
router.get("/users", (request, response) => {
    appUtils.setCookieURL(request);
    if (appUtils.checkCookie(request) && request.session.loggedin && request.session.userLevel == 2) {
        appUtils.extendCookie(request);
        db.runQuery("SELECT * FROM `users`")
            .then(
                (res) => {

                    response.status(200); // 200 is OK 
                    response.render("pages/users", {
                        page_name: 'users',
                        data: res,
                        activeUser: {
                            username: request.session.username,
                            userLevel: request.session.userLevel
                        }
                    });
                }
            )
            .catch(
                (err) => {
                    response.status(400); // 400 is NOT OK 
                    response.send(err);
                }
            )
    } else {
        response.status(200); // 200 is OK 
        response.redirect('/');
    }
});



module.exports = router;