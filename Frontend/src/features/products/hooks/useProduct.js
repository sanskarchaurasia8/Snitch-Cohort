import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant, updateVariantStock, deleteVariant } from "../service/product.api";
import {useDispatch} from "react-redux"
import { setSellerProducts, setProducts } from "../state/product.slice";


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

    async function handleGetAllProducts() {

        const data = await getAllProducts()
        dispatch(setProducts(data.products))
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant);

        return data
    }

    // async function handleUpdateVariantStock(productId, variantId, stock) {
    //     return await updateVariantStock(productId, variantId, stock);
    // }

    // async function handleDeleteVariant(productId, variantId) {
    //     return await deleteVariant(productId, variantId);
    // }

    return {
        handleCreatProduct, 
        handleGetSellerProduct, 
        handleGetAllProducts, 
        handleGetProductById,
        handleAddProductVariant,
        // handleUpdateVariantStock,
        // handleDeleteVariant
    }
}

    