const { Number } = require("core-js");
const mongoose = require("../configs/mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"]
    },
    id: {
        type: Number
    },
    amountAvailable: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        // index: true,
        min: [0, "Price cannot be negative"]
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { _id: false });

productSchema.plugin(AutoIncrement);

const Product = mongoose.model("Product", productSchema);


Product.processErrors = (err) => {
    const msg = {};
    for (const key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

module.exports = Product;
