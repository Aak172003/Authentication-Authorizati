// Make three protected routes for different different role

// auth -> authentication ke lie 

// And isStudent and isAdmin are both for authorization
// isStudent ke lie
// isAdmin ke lie 


// used to create json web token by server 
const jwt = require("jsonwebtoken");


// Import Config file 
require('dotenv').config();


// --------------->  next is used to call the next middleware as just you define <-------------

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

        console.log("cookies ", req.cookies.token);
        console.log("body ", req.body.token);
        console.log("header ", req.header("Authorization"))


        // Extract Token from multiple methods

        // Tokens can be fetch from 1. Body , 2. Cookies se  , 3. Header se
        // const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        // Tokens can be fetch from 1. Cookies se , 2. Body , 3. Header se
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        // From verify() function , we easily can verify the token

        try {

            // verify krdia apne payload ko jiise humne ek JWT token create kia tha ,
            // jwt.verify krne ek decoded form me apne ko payload mil jaega 
            // or decode done by using secret key

            const payload = jwt.verify(token, process.env.JWT_SECRET);

            console.log("                                       ");
            console.log("                                       ")
            console.log("Here i get our payload data with the help of secret key ", payload);

            // req.user ke sth store krlia 

            // *******************************************************************************

            // req.user = payload
            // Why this ? 

            // Ans -> Token kaha pda hai user ke ander hai ,
            //  or yaha user wo hai jo registered person hai
            // Token create kete time jo payload dia tha jisse wo token create kia hai , 
            // us me se role nikal kr compare kr lenge ki wo Amin hai ya user  ,

            // req.user = decode kyuki aage jaakr check krna hai , kis role se request kia hai 
            // Payload ko add krdeia request me  , 
            // just ye show krana ke lie ki maine jo data dia tha JWT Token bnane ke lie ,
            //  wo sb kya kya data tha 


            // *******************************************************************************

            req.user = payload;
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
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}

// Protected handler for isStudent route 
exports.isStudent = (req, res, next) => {
    try {

        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Student "

            })
        }
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

// *****************************************************************

// Protected handler for isAdmin route 

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a prptected route for Admin "
            })
        }

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



