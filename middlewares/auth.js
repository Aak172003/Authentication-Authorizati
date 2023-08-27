// Make three protected routes for different different role

// auth -> authentication ke lie 

// And isStudent and isAdmin are both for authorization
// isStudent ke lie
// isAdmin ke lie 


// used to create json web token by server 
const jwt = require('jsonwebtoken')


// Import Config file 
require('dotenv').config();

// --------------------------------->  next is used to call the next middleware   <-----------------------

// Because here i use for two middleware for isStudent 
// 1. auth for authentiacation 
// 2. Check click as a student request bhej rha hai ya nhi , ye hume uske role se pta lgaega 


// Because here i use for two middleware for isAdmin
// 1. auth for authentiacation 
// 2. Check click as a Admin request bhej rha hai ya nhi , ye hume uske role se pta lgaega 


// Protected handler for auth route 
exports.auth = (req, res, next) => {
    try {

        // extract jwt token , beacuse token ke behalf pr mai , 
        // ye find kr paungs is this user is a authenticate person or not 

        // Tokens can be fetch from 1. Body , 2. Headers , 3. Cookies se 
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing '
            })
        }

        // From verify() function , we easily can verify the token

        try {

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);

            // req.user ke sth store krlia 

            // *******************************************************************************

            // req.user = decode
            // Why this ? 

            // Ans -> Token kaha pda hai user ke ander hai , or yaha user wo hai jo registered person hai
            // Token create kete time payload me role bhi define kia hai , so hum token ko verify krlenge  ,
            // or the decode krdenge , token ko , phr uske ander se role nikal lenge payload se 

            // *******************************************************************************

            // req.user = decode kyuki aage jaakr check krna hai , kis role se request kia hai 
            req.user = payload
            // req.user ke ander i store payload 


        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is InValid'
            });
        }
        // go to next route

        next();

    }
    catch (error) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Some Thing went wrong ",
        })
    }
}

// Protected handler for isStudent route 
exports.isStudent = (req, res, next) => {
    try {

        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a prptected route for Student "

            });
        };
        // go to next route 
        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching "
        })

    }
}


// Protected handler for isAdmin route 

exports.isAdmin = (req, res, next) => {
    try {

        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a prptected route for Admin "

            });
        };

        // go to next route 
        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching "
        })

    }
}









