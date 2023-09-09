const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");


//Create New Order
exports.newOrder = catchAsyncError (async(req,res,next)=> {
    const {shippingInfo, 
           orderItems, 
           paymentInfo, 
           itemPrice, 
           taxPrice, 
           shippingPrice, 
           totalPrice
        } = req.body;

    const order = await Order.create({
        shippingInfo, 
           orderItems, 
           paymentInfo, 
           itemPrice, 
           taxPrice, 
           shippingPrice, 
           totalPrice,
           paidAt: Date.now(),
           user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });
});

//Get Single Order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
      return next(new ErrorHandler(`order not found with this ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        order,
    });
});


//Get Logged In User Single Order
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const order = await Order.find({user:req.user._id});


    res.status(200).json({
        success:true,
        order,
    })
});

//Get All Orders --ADMIN
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmt=0;

    orders.forEach((order)=>{
        totalAmt+=order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmt,
        orders,
    });
});

//Update Order status --ADMIN
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler(`order not found with this ${req.params.id}`,404));
      }

    if(order.orderStatus==="Delivered") {
        return next(new ErrorHandler(`Order Already Delivered!`, 400)); 
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product, o.quantity);
    });

    order.orderStatus = req.body.status;
    
    if(req.body.status==="Delivered") {
    order.deliveredAt = Date.now();
    }

    await order.save({ValidateBeforeSave:false});
    res.status(200).json({
        success:true,
    });
});

async function updateStock(id,quantity) { 
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({ValidateBeforeSave:false});

}


//Delete Order --ADMIN
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler(`order not found with this ${req.params.id}`,404));
      }

    await order.deleteOne();

    res.status(200).json({
        success:true,
    });
});

