import axios from "axios";


const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,

});

export const addItem = async ({ productId, variantId, quantity = 1 }) => {
    try {
        const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Cart API Error:", error.response?.data || error.message);
        throw error;
    }
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/");
    return response.data;
} 

export const incrementCartItemApi = async ({ productId,variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`);
    return response.data;
}

export const decrementCartItemApi = async ({ productId,variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`);
    return response.data;
}