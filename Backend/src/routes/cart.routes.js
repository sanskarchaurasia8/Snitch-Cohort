import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateRequest, validatIncrementCartItemQuantity } from "../validator/cart.validator.js";
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity } from "../controllers/cart.controller.js";

const router = express.Router();


/** 
 * @router POST /api/cart/add/:protectId/:variantId
 * @description Add a product to the cart
 * @access Private
 * @argument protectId - Id of the product to add
 * @argument variantId - Id of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, validateRequest, addToCart)



/** 
 * @router GET /api/cart
 * @description Get the user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart)


/** 
 * @router PATCH /api/cart/quantity/increment/:productId/:variantId
 * @description Increment the quantity of a variant of a product in the cart
 * @access Private
 * @argument productId - Id of the product to update in the cart
 * @argument variantId - Id of the variant to update in the cart
 */
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validatIncrementCartItemQuantity, incrementCartItemQuantity)

/** 
 * @router PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @description Decrement the quantity of a variant of a product in the cart
 * @access Private
 * @argument productId - Id of the product to update in the cart
 * @argument variantId - Id of the variant to update in the cart
 */
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validatIncrementCartItemQuantity, decrementCartItemQuantity)

export default router;