import {addItem} from "../service/cart.api";

export const useCart = () => {
    async function handleAddItem(productId, variantId, quantity = 1) {
       const data = await addItem({productId, variantId, quantity});

       return data;
    }

    return {handleAddItem};
}