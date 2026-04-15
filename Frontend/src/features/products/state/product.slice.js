import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",
    initialState: {
        SellerProducts: []
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.SellerProducts = action.payload;
        }
    }
});

export const { setSellerProducts } = productSlice.actions;
export default productSlice.reducer;