const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//Creating a Product. --ADMIN
exports.createProduct = catchAsyncError(async (req,res,next)=>{

    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    });
});

//Get All Product
exports.getAllProducts =catchAsyncError( async (req, res)=>{

    const resultPerPage = 5; 

    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success:true,
        products

    });
});

//GET Single Product details

exports.getProductDetail = catchAsyncError(async (req,res,next) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    res.status(200).json({
        success:true,
        product,
        productCount,
    })
});

//Update Product --ADMIN
exports.updateProduct = catchAsyncError(async (req,res,next)=>{
    let product = Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    } 
    product = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new:true, 
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
});

//Delete a Product --ADMIN

exports.deleteProduct = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Found",404));
    }
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message : "Deleted successfully!"
    });
});

