import {addItem, getCart} from "../service/cart.api";
import { useDispatch } from "react-redux";
import {setItems} from "../state/cart.slice";

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

    return {handleAddItem, handleGetCart};
}