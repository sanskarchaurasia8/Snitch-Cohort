import {addItem, getCart, incrementCartItemApi, decrementCartItemApi} from "../service/cart.api";
import { useDispatch } from "react-redux";
import {setItems, incrementCartItem, decrementCartItem} from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    async function handleAddItem(productId, variantId, quantity = 1) {
       try {
           const data = await addItem({productId, variantId, quantity});
           return data;
       } catch (error) {
           console.error("Error adding item to cart", error);
           throw error;
       }
    }

    async function handleGetCart() {
        try {
            const data = await getCart();
            console.log("Cart API Response:", data);
            
            if (data && data.cart && data.cart.items) {
                dispatch(setItems(data.cart.items));
            } else {
                console.warn("Cart items not found in response", data);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
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