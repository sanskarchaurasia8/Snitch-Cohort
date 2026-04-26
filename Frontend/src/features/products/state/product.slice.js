import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        SellerProducts: [],
        products: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.SellerProducts = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload
        }
    }
});

export const { setSellerProducts, setProducts } = productSlice.actions;
export default productSlice.reducer;