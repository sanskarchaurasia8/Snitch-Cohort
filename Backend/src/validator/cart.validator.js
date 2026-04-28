import { param, body, validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid Product Id"),
    param("variantId").optional().isMongoId().withMessage("Invalid Variant Id"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be atleast 1"),
]