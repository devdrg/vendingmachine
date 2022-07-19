const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is mandatory"],
        unique: [true, "username already taken"],
        minlength: [3, "username must not be less that 3 characters"]
    },
    password: {
        type: String,
        minlength: [3, "Password must not be less that 3 characters"],
        required: [true, "Password is mandatory"],
        // match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/, "Password must have min 6 characters, at least one uppercase and one number."],
        select: false
    },
    role: {
        type: String,
        enum: ['Buyer', 'Seller'],
        default: 'Buyer'
    },
    deposit: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
});

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

User.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    if (err.errmsg !== undefined && err.errmsg.indexOf("dup key") > -1) {
        msg.username = "Duplicate field detected";
    }
    return msg;
};

module.exports = User;
