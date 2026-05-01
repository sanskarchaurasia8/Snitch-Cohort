import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    });

    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    });

}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products retrieved successfully",
        success: true,
        products
    });
}

export async function getAllProducts(req, res) {
    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched Successfully",
        success: true,
        products
    })
}

export async function getProductDetail(req, res) {
    const { id } = req.params;
    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        product
    })
}

export async function addProductVariant(req, res) {
    try {
        const productId = req.params.productId;

        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // 🔹 Images (optional - handle if no files provided)
        const files = req.files || [];
        let images = [];

        if (files.length > 0) {
            images = await Promise.all(
                files.map(async (file) => {
                    return await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname
                    });
                })
            );
        }

        // 🔹 Basic fields parsing and validation
        const stock = Number(req.body.stock);
        const priceAmount = Number(req.body.priceAmount);

        if (isNaN(stock) || isNaN(priceAmount)) {
            return res.status(400).json({
                message: "Invalid stock or price amount",
                success: false
            });
        }

        // 🔹 Safe parsing of attributes
        let attributes = {};
        if (req.body.attributes) {
            let parsedAttr = req.body.attributes;
            if (typeof req.body.attributes === "string") {
                try {
                    parsedAttr = JSON.parse(req.body.attributes);
                } catch (error) {
                    return res.status(400).json({
                        message: "Invalid attributes format. Must be valid JSON string.",
                        success: false
                    });
                }
            }
            
            if (Array.isArray(parsedAttr)) {
                parsedAttr.forEach(attr => {
                    if (attr.key && attr.value) {
                        attributes[attr.key] = attr.value;
                    }
                });
            } else if (typeof parsedAttr === "object" && parsedAttr !== null) {
                attributes = parsedAttr;
            }
        }

        // 🔹 Variant object construction
        const variant = {
            images,
            stock,
            attributes,
            price: {
                amount: priceAmount,
                currency: "INR"
            }
        };

        // 🔹 Save variant to product
        product.variants.push(variant);
        await product.save();

        return res.status(201).json({
            message: "Variant added successfully",
            success: true,
            product
        });

    } catch (error) {
        console.error("Error adding variant:", error);
        return res.status(500).json({
            message: "Failed to add variant",
            success: false
        });
    }
}
