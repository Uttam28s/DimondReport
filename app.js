const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const env = require("dotenv").config().parsed;
const passport = require("passport");
const { mainRoutes } = require("./Routes/index");
const port = 3003;
const cors = require("cors");

const dConnection = `${process.env.DATABASE}` || "mongodb+srv://Uttam28s:76986Utt%40m@diamond.sswlz.mongodb.net/DiamondReport?retryWrites=true&w=majority";

// 'mongodb+srv://Uttam28s:76986%40Uttam@diamond.sswlz.mongodb.net/Diamond?retryWrites=true&w=majority'
// env.DB_CONNECTION +
// "://" +
// env.DB_HOST +
// ":" +
// env.DB_PORT +
// "/" +
// env.DB_DATABASE;

const options = {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
};
mongoose
    .connect(dConnection, options)
    .then(() => {
        console.log("DB Connected!");
    })
    .catch((err) => {
        throw new Error("Database credentials are invalid.");
    });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Getting Request
app.get('/', (req, res) => {
 
    // Sending the response
    res.send('Hello World!')
    
    // Ending the response
    res.end()
})

// app.use("/api/auth", authRoute);
app.use("/api/diamond", mainRoutes);


// app.use(passport.initialize());
// app.use(passport.session());


app.listen(port, () => {
    console.log("server started on", port);
});
