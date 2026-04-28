import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant } from "../service/product.api";
import {useDispatch} from "react-redux"
import { setSellerProducts, setProducts } from "../state/product.slice";
import { useCallback } from "react";

export const useProduct = () => {
    const dispatch = useDispatch()

    const handleCreatProduct = useCallback(async (fromData) => {
        const data = await createProduct(fromData)
        return data.useProduct
    }, []);

    const handleGetSellerProduct = useCallback(async () => {
        const data = await getSellerProduct() 
        dispatch(setSellerProducts(data.products))
        return data.products     
    }, [dispatch]);

    const handleGetAllProducts = useCallback(async () => {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
    }, [dispatch]);

    const handleGetProductById = useCallback(async (productId) => {
        const data = await getProductById(productId)
        return data.product
    }, []);

    const handleAddProductVariant = useCallback(async (productId, newProductVariant) => {
        const data = await addProductVariant(productId, newProductVariant);
        return data
    }, []);

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

    