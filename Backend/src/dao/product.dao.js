import productModel from "../models/product.model.js";

export const stockOfVariant = async(productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        "varients._id": variantId
    });

    const stock = product.varients.find(variant => variant._id.toString() === variantId).stock;

    return stock;
    
}