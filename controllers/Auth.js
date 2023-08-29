// To interact with db 
const User = require('../models/User');

// Password ko hash kne ke kaam aaega 
const bcrypt = require('bcrypt');

// used to create json web token by server 
const jwt = require('jsonwebtoken');


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
        // respond true  status 
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

        // Payload me just req ka data aaega , jo ki compare krne ke lie use hoga 
        const payload = {

            email: user.email,
            // through id we can acces aal data through its id 

            id: user._id,
            role: user.role
        }

        // Verify password  & generate a JWT Token
        // bcrypt.compare(password, user.password)

        // this compare fuction is used to compare the password , 
        // bcrypt.compare(data , jisse compare krna chah rhe hai wo )

        if (await bcrypt.compare(password, user.password))
        // If True 
        {
            // If match the password 

            // This create token , 

            // and it accept -> Payload and Secret Key (Secret_Key -> define by user )
            // sign hone ke bdd user me ek token naam ka filed bna kr usme token daal denge  

            // payload means , ek token create tbhi hoga jb usme hum user data , secret key denge 
            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m", });

            // create a new file in user , name as token


            // Make user as Object by use of toObject()
            user = user.toObject();

            user.token = token;

            // from user , make password as undefined  , 
            // this is necessary beacuse if i sne token , 
            // so haker ke pss token as well as password bhi hone ki possiblity ho skti hai 

            user.password = undefined;

            console.log(user);

            // cookies ke parameter define , kb tk valid rhega or else 
            const options = {
                // 3 * 24 * 60 * 60 * 1000 represent day hour min sec millisecond

                expiresIn: new Date(Date.now() + 1000),
                httpOnly: true,
            }

            // Send Cookies
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in succesFully",
            });

            // Send without cookie 
            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "user logged in succesFully",
            // });

        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be login ,Please try again later",
        })
    }
}