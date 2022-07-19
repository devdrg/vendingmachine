const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userService = {};

/// REGISTER
userService.registerUser = async function (req, res) {

    const {
        username,
        password,
        confirmPassword,
        role
    } = req.body;

    // password hashing
    const salt = await bcrypt.genSalt(10);

    if (password === confirmPassword ) {
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            role,
            password: hashedPassword
        });
        await newUser.save();
    } else {
        return res.status(400).json({
            msg: { password: "Password is mandatory." }
        });
    }

    
};

// 5, 10, 20, 50 and 100
userService.userDeposit = async function (req, res) {
    const amountToDeposit = req.body.amountToDeposit;
    const id = res.locals.user.id;
    const foundUser = await User.findById(id);
    
    if (foundUser && (foundUser.role == "Buyer")) {
        try {
            foundUser.deposit = foundUser.deposit + amountToDeposit;
            await foundUser.save();
            res.status(200).json({
                updatedDeposit: foundUser.deposit
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                msg: User.processErrors(error)
            });
        }
    }
};

userService.userResetDeposit = async function (req, res) {
    const id = res.locals.user.id;
    const foundUser = await User.findById(id);

    if (foundUser && (foundUser.role == "Buyer")) {
        try {
            foundUser.deposit = 0;
            await foundUser.save();
            res.status(200).json({
                updatedDeposit: foundUser.deposit
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                msg: User.processErrors(error)
            });
        }
    }
};


userService.loginJWT = async function (req, res) {
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i'), isDeleted: false }).select("+password");
        const comparePasswords = await bcrypt.compare(password, foundUser.password);
        if (foundUser !== null && comparePasswords) {
            delete foundUser.password;
            const returnedToken = jwt.sign({ id: foundUser._id }, process.env.APP_SECRET, { expiresIn: '30d' });
            console.log(returnedToken);
            return res.status(200).json({
                // token: `Bearer ${token}`
                user: foundUser,
                token: returnedToken
            });
        } else {
            return res.status(404).json({
                msg: "Account does not exist"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            err: true,
            msg: User.processErrors(error)
        });
    }
};



userService.getLoggedInUserProfile = async function (req, res) {
    try {
        const id = res.locals.user.id.toString();
        const foundUser = await User.findById(id);
        if (foundUser) {
            return res.status(200).json({
                // token: `Bearer ${token}`
                success: true,
                user: foundUser
            });
        } else {
            return res.status(404).json({
                msg: "Cont inexistent"
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            err: true,
            msg: User.processErrors(error)
        });
    }
};

module.exports = userService;
