import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items = action.payload
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

export const { setItems, addItem, incrementCartItem, decrementCartItem } = cartSlice.actions;
export default cartSlice.reducer;