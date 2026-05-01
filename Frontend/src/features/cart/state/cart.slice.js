import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: 0,
        currency: "INR",
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalPrice = action.payload.totalPrice || 0;
            state.currency = action.payload.currency || "INR";
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;

            state.items = state.items.map(item => {
                if (item.product?._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item;
                }
            })
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload;

            state.items = state.items.map(item => {
                if (item.product?._id === productId && item.variant === variantId && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 }
                } else {
                    return item;
                }
            })
        }
    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;