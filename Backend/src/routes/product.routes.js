import express from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct, getSellerProducts, getAllProducts, getProductDetail, addProductVariant} from '../controllers/product.controller.js';
import multer from 'multer';
import { createProductValidator } from '../validator/product.validator.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

const router = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)   
 */

router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

/**
 * @route GET /api/products/seller
 * @desc Get all products of the authenticated seller
 * @access Private (Seller only)
 */

router.get("/seller", authenticateSeller, getSellerProducts)


/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get("/", getAllProducts)

/**
 * @route GET /api/products/:id
 * @desc Get a single product by ID
 * @access Public
 */
router.get("/detail/:id", getProductDetail)

/**
 * @route POST /api/products/:productId/variants
 * @desc Add a variant to a product
 * @access Private (Seller only)
 */
router.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariant)

// /**
//  * @route PATCH /api/products/:productId/variants/:variantId/stock
//  * @desc Update variant stock
//  * @access Private (Seller only)
//  */
// router.patch("/:productId/variants/:variantId/stock", authenticateSeller, updateVariantStock)

// /**
//  * @route DELETE /api/products/:id/variants/:variantId
//  * @desc Delete a variant from a product
//  * @access Private (Seller only)
//  */
// router.delete("/:id/variants/:variantId", authenticateSeller, deleteVariant)

export default router;