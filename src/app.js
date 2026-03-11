const express = require("express")

const app = express()
app.use(express.json())

/* require all routes here*/
const authRouter = require("./routes/auth.route")


/* use all routes here*/
app.use("/api/auth", authRouter)






module.exports = app


//app.js mainly 2 works
// 1. server initiate krna/instance create krna (const app = express() app.use(express.json()))

// 2. route/middleware ko yha use krna 

// 3. server.js server start krta 