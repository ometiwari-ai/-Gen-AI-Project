const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { useReducer } = require("react");

/**
 * @route POST /api/auth/register
 * @desc Register a new use. needed fields: username, email, password
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body; // destructuring

    if (!username || !email || !password) {  // to check if any missing field
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }]  // or operatore,  used to check if any field already exist
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "User already exist with this username or email"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" }
    )
    res.send(201).json({
        msg: " User registered Succesfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


module.exports = { registerUserController }