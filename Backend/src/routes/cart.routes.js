import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateRequest } from "../validator/cart.validator.js";
import {addToCart,getCart} from "../controllers/cart.controller.js";

const router = express.Router();    


/** 
 * @router POST /api/cart/add/:protectId/:variantId
 * @description Add a product to the cart
 * @access Private
 * @argument protectId - Id of the product to add
 * @argument variantId - Id of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser,validateAddToCart,validateRequest, addToCart)



/** 
 * @router GET /api/cart
 * @description Get the user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart)

export default router;