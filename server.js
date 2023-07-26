const express = require("express")
const mongoose = require("mongoose")
const app = express();
require('dotenv').config();
const mongoString = process.env.DB_URL
var bodyParser = require('body-parser');
const port = 3000
const routes = require('./Routes/route');


mongoose.connect(mongoString).then(() => {
    console.log("Connected to mongoDB")
    app.listen(port, () => {
        console.log("App listening on port " + port);
    })
}).catch((error) => {
    console.log("There is an error : " + error.message)
})
app.use(express.json());
app.use("/api", routes);

