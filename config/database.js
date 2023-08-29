
const mongoose = require('mongoose');

require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;


const dbConnect = () => {
    mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected Succesfully : ")
    }).catch((error) => {
        console.log("Issue in Db Connection ")
        console.error(error.message);
        process.exit(1);
    });

}



module.exports = dbConnect;