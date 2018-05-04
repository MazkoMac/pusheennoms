var express = require('express');
var router = express.Router();

const utils = require('../middlewares/loginUtils');

router.get('/', function (req, res, next) {
    res.render('login.hbs')
});

/**
 * After adding a new chef to the chef file, redirects to home page
 */
router.post('/registerchef', (request, response) => {
    var valid = utils.validateInput(request.body.username, request.body.password);
    var noRepeat = utils.noRepeatUsers(request.body.username)

    if (valid === true && noRepeat === true) {
        utils.addToChefFile(request.body.username, request.body.password);
        response.render('login.hbs', {
            status: 0
        });
    }
    else if (valid === false) {
        response.render('login.hbs', {
            status: 1
        });
    }
    else if (noRepeat === false) {
        response.render('login.hbs', {
            status: 2
        });
    }
});

/**
 * Handles logging in the user
 */
router.post('/getpass', (request, response) => {
    inpUsername = request.body.username;
    inpPassword = request.body.password;

    var authenticationResult = utils.authenticateChef(inpUsername, inpPassword);
    if (authenticationResult === 'authentication failure') {
        response.redirect('/')
    } else if (authenticationResult === 'logged in') {
        response.render('home.hbs', {
            resultRecipes: JSON.stringify([{
                currentUser: inpUsername
            }])
        })
    } else if (authenticationResult === 'no username') {
        response.render('login.hbs', {
            usernameDoesNotExist: true
        })
    }
});


module.exports = router;