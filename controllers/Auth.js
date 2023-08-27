
const User = require('../models/User')
// Password ko hash kne ke kaam aaega 
const bcrypt = require('bcrypt');

// used to create json web token by server 
const jwt = require('jsonwebtoken')


// Import Config file 
require('dotenv').config();


// Signup route Handler 
exports.signup = async (req, res) => {
    try {
        // get data
        const { name, email, password, role } = req.body;

        // check if user already exist 
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        // take a varible Secured password 
        let hashedPassword;

        // Exception handling perform , whether i succesfully generate hash password or not
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create Entry for User , with role
        let user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // If succesfully create a entry for A user ,
        // respond true status 
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

// Login system
exports.login = async (req, res) => {
    try {

        // get data Fetch
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the data carefully  '
            })
        }

        // check if user already exist or not 
        let user = await User.findOne({ email });

        // IF user not registerd 
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'user is not registered '
            })
        }

        // Create payload 
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        // Verify password 
        // bcrypt.compare(password, user.password)

        // this compare fuction is used to compare the password , 
        // bcrypt.compare(data , jisse compare krna chah rhe hai wo )

        if (await bcrypt.compare(password, user.password))
        // If True 
        {
            // If match the password 

            // This create token , 
            // and it accept -> Payload and Secret Key (Secret_Key -> define by user )
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h", });

            // create a new file in user , name as token
            console.log(user);

            // Make user as Object by use of toObject()
            user = user.toObject();
            user.token = token;

            // from user , make password as undefined  , 
            // this is necessary beacuse if i sne token , 
            // so haker ke pss token as well as password bhi hone ki possiblity ho skti hai 

            console.log(user);
            user.password = undefined;

            console.log(user)

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            // Send Cookies 
            res.cookie("my Cookies", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in succesFully",
            })

        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password not Match",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be login ,Please try again later",
        })
    }

}
