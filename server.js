const express = require("express")
const mongoose = require("mongoose")
const app = express();
require('dotenv').config();
const mongoString = process.env.DB_URL
var bodyParser = require('body-parser');
const port = 3000

const chatConroller = require('./Controller/chatController')

const routes = require('./Routes/route');
const notificationRoute = require('./Routes/notificationRoute')
const userRoute = require('./Routes/userRoute')
const registerRoute = require('./Routes/registerRoute')
const loginRoute = require('./Routes/loginRoute')
const followerRelationRoute = require('./Routes/followerRelationRoute')
const postRoute = require('./Routes/postRoute')
const commentRoute = require('./Routes/commentRoute')
const likeRoute = require('./Routes/likeRoute')




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
app.use("/api", notificationRoute)
app.use("/api", userRoute)
app.use("/api", registerRoute)
app.use("/api", loginRoute)
app.use("/api", followerRelationRoute)
app.use("/api", postRoute)
app.use("/api", commentRoute)
app.use("/api", likeRoute)



