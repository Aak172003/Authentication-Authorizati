
// Use router , and we know round is part of express , so first require express 

const express = require("express");
const router = express.Router();

// Call Function , 
// Beacuse Kon se path hit hone pr kon sa controller kaam krega 

// Import as Object Beacuse , From controller i pass , 
// Object 
const { login, signup } = require('../controllers/Auth')


// Import Protected Route
const { auth, isStudent, isAdmin } = require('../middlewares/auth')

// router.post('/login', login);

router.post('/signup', signup);
router.post('/login', login);


// /test protected route for test ( single Middleware )

router.get('/test', auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Student ",
    });
})


// Protected Routes

// /student route hit hote hi 
// 1. auth handler -> chechk, wheter this person is authenticate user or not
// 2. isStudent handler -> check this cliext enter for which role, is it Student or not

// payload se role nikal kr compare krna pdega  

router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Student ",
    });
})


// // Protected Route For Admin 

router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Admin ",
    });
})

module.exports = router;