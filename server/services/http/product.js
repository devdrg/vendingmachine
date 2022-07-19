const { stripVTControlCharacters } = require("util");
const Product = require("../../models/product");
const User = require("../../models/user");

const productService = {};


productService.getAllProducts = async function (req, res) {
    try {
        const allProducts = await Product.find({});
        return res.status(200).json({
            products: allProducts
        });
    } catch (error) {
        return res.status(400).json({
            msg: Product.processErrors(error)
        });
    }
};

productService.getMyProducts = async function (req, res) {
    try {
        const allProducts = await Product.find({});
        return res.status(200).json({
            products: { items: AllProducts }
        });
    } catch (error) {
        return res.status(400).json({
            msg: Product.processErrors(error)
        });
    }
};

productService.getProductDetails = async function (req, res) {
    const productId = req.params.id;
    const user = res.locals.user;
    console.log(user);
    try {
        // console.log(selectedAuction.visitors);
        await Product.findById(productId).then(async (selectedProduct) => {
        
    })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: Product.processErrors(error)
        });
    }
};

productService.createNewProduct = async function (req, res) {
    const id = res.locals.user.id;
    const newProduct = new Product({
        productName: req.body.productName,
        cost: req.body.cost,
        amountAvailable: req.body.amountAvailable,
        sellerId: res.locals.user.id
    });
    const foundUser = await User.findById(id);

    if (foundUser && (foundUser.role == "Seller")) {
        try {
            await newProduct.save();
            res.status(200).json({
                product: newProduct
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                msg: Product.processErrors(error)
            });
        }
    }
};

productService.editProduct = async function (req, res) {
    const product = req.body;
    const foundProduct = await Product.findById(req.params.id);

    foundProduct.productName = product.productName;
    foundProduct.amountAvailable = product.amountAvailable;
    foundProduct.cost = product.cost;

    try {
        const updatedProduct = await foundProduct.save();
        res.status(200).json({
            product: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: Product.processErrors(error)
        });
    }
};

productService.deleteProduct = async function (req, res) {
    const product = req.params.id
    try {
        const productToDelete = await Product.findById(product)
        await productToDelete.remove();
        res.status(200).json({
            msg: `successfully deleted product: ${productToDelete.productName}`
        });
    } catch (error) {
        res.status(400).json({
            msg: Product.processErrors(error)
        });
    }
};

productService.buyProduct = async function (req, res) {
    const userId = res.locals.user.id;
    const productId = req.params.id;

        try {
            const stock = await Product.findById(productId);
            const user = await User.findById(userId);
            if (stock.amountAvailable > 0 && user.role == "Buyer") {
                stock.amountAvailable -= 1;
                await stock.save();
                user.deposit -= stock.cost;
                await user.save();
                res.status(200).json({
                    msg: `successfuly bought product ${stock.productName}`,
                    productId: stock._id
                });
                
            } else {
                res.status(404).json({
                    msg: "product is out of stock",
                    productId: stock._id
                });
            }
        } catch (error) {
            res.status(400).json({
                msg: Product.processErrors(error)
            });
        }
};

module.exports = productService;
