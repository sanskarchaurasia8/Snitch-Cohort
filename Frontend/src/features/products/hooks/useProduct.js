import { createProduct, getSellerProduct } from "../service/product.api";
import {useDispatch} from "react-redux"
import { setSellerProducts } from "../state/product.slice";


export const useProduct = () => {
    const dispatch = useDispatch()

    async function handleCreatProduct (fromData){
        const data = await createProduct(fromData)

        return data.useProduct
    }

    async function handleGetSellerProduct() {

        const data = await getSellerProduct() 
        dispatch(setSellerProducts(data.products))
        return data.products
            
    }

    return {handleCreatProduct, handleGetSellerProduct}
}

    