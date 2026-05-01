import {addItem, getCart, incrementCartItemApi, decrementCartItemApi} from "../service/cart.api";
import { useDispatch } from "react-redux";
import {setCart, incrementCartItem, decrementCartItem} from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    async function handleAddItem(productId, variantId, quantity = 1) {
       try {
           const data = await addItem({productId, variantId, quantity});
           // Fetch updated cart to reflect changes in UI
           await handleGetCart();
           return data;
       } catch (error) {
           console.error("Error adding item to cart:", error.response?.data || error.message || error);
           throw error;
       }
    }

    async function handleGetCart() {
        try {
            const data = await getCart();
            console.log("Cart API Response:", data);
            
            let cartObj = { items: [], totalPrice: 0, currency: "INR" };
            if (Array.isArray(data?.cart)) {
                cartObj = data.cart[0] || cartObj;
            } else if (data?.cart) {
                cartObj = data.cart;
            }
            
            // Update Redux store with full cart object
            dispatch(setCart(cartObj));
            
            if (!data?.cart) {
                console.warn("Cart data not found in response", data);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error?.response?.data || error);
        }
    }

    async function handleIncrementCartItem(productId, variantId) {
        const data = await incrementCartItemApi({productId, variantId});
        dispatch(incrementCartItem({productId, variantId}))
    }

    async function handleDecrementCartItem(productId, variantId) {
        const data = await decrementCartItemApi({productId, variantId});
        dispatch(decrementCartItem({productId, variantId}))
    }

    return {handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem};
}