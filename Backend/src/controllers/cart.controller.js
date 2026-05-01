import mongoose from "mongoose";
// import { ObjectId } from "mongodb";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import {stockOfVariant} from "../dao/product.dao.js";

export const addToCart = async(req,res)=>{
    
    const {productId,variantId} = req.params;
    const {quantity = 1} = req.body;
    
    const product = await productModel.findOne({
        _id: productId,
        "variants._id":variantId
    });
    
    if(!product){
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    const stock = await stockOfVariant(productId,variantId);

    const cart = (await cartModel.findOne({ user: req.user._id})) || await cartModel.create({ user: req.user._id});

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId);

    if(isProductAlreadyInCart){
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity; 

       if(quantityInCart + quantity > stock){
            return res.status(400).json({
                message: "Quantity exceeds stock",
                success: false
            });
       }

       // Get the variant to get its price
       const variant = product.variants.id(variantId);
       const variantPrice = variant?.price || product.price;

       await cartModel.findOneAndUpdate(
        { user: req.user._id,"items.product": productId, "items.variant": variantId},
        {$inc:{"items.$.quantity": quantity}, $set:{"items.$.price": variantPrice}},
        {new: true}
       )

       return res.status(200).json({
        message: "Product added to cart",
        success: true
       });
    }

    if(quantity > stock){
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        });
    }

    // Get the variant to get its price
    const variant = product.variants.id(variantId);
    const variantPrice = variant?.price || product.price;

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: variantPrice
    });
    await cart.save();
    return res.status(200).json({
        message: "Product added to cart",
        success: true
    });
    
    
}

export const getCart = async (req,res) => {
    const user = req.user

    let cart = (await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        itemPrice: {
          price: {
            $multiply: [
              '$items.quantity',
              '$items.product.variants.price.amount'
            ]
          },
          currency:
            '$items.product.variants.price.currency'
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$itemPrice.price' },
        currency: {
          $first: '$itemPrice.currency'
        },
        items: { $push: '$items' }
      }
    }
  ]))[ 0 ]

    if(!cart){
        cart = await cartModel.create({ user: user._id});
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
}

export const incrementCartItemQuantity = async (req,res) => {
    const {productId,variantId} = req.params;
    
    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if(!product){
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id});

    if(!cart){
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId,variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId) || 0;

    if(itemQuantityInCart + 1 > stock){
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId},
        {$inc:{"items.$.quantity": 1}},
        {new: true}
    )

    return res.status(200).json({
        message: "Cart Item Quantity incremented successfully",
        success: true
    });

}

export const decrementCartItemQuantity = async (req,res) => {
    const {productId,variantId} = req.params;
    
    const cart = await cartModel.findOne({ user: req.user._id});

    if(!cart){
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId);

    if(!cartItem){
        return res.status(404).json({
            message: "Item not found in cart",
            success: false
        })
    }

    if(cartItem.quantity <= 1){
        return res.status(400).json({
            message: "Quantity cannot be less than 1. Use remove item instead.",
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId},
        {$inc:{"items.$.quantity": -1}},
        {new: true}
    )

    return res.status(200).json({
        message: "Cart Item Quantity decremented successfully",
        success: true
    });

}



// Aggregation Pipelinea Data


//   [
//     {
//       $match: {
//         user: ObjectId('69db878b7bd7af19160fb798')
//       }
//     },
//     { $unwind: { path: '$items' } },
//     {
//       $lookup: {
//         from: 'products',
//         localField: 'items.product',
//         foreignField: '_id',
//         as: 'items.product'
//       }
//     },
//     { $unwind: { path: '$items.product' } },
//     {
//       $unwind: { path: '$items.product.variants' }
//     },
//     {
//       $match: {
//         $expr: {
//           $eq: [
//             '$items.variant',
//             '$items.product.variants._id'
//           ]
//         }
//       }
//     },
//     {
//       $addFields: {
//         itemPrice: {
//           price: {
//             $multiply: [
//               '$items.quantity',
//               '$items.product.variants.price.amount'
//             ]
//           },
//           currency:
//             '$items.product.variants.price.currency'
//         }
//       }
//     },
//     {
//       $group: {
//         _id: '$_id',
//         totalPrice: { $sum: '$itemPrice.price' },
//         currency: {
//           $first: '$itemPrice.currency'
//         },
//         items: { $push: '$items' }
//       }
//     }
//   ]