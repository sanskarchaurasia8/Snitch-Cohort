import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
});

export async function createProduct(formData) {
    const responce = await productApiInstance.post("/", formData)

    return responce.data;
}

export async function getSellerProduct() {
    const responce = await productApiInstance.get("/seller")
    return responce.data;
}

export async function getAllProducts() {
    const responce = await productApiInstance.get("/")
    return responce.data
}

export async function getProductById(productId) {
    const responce = await productApiInstance.get(`/detail/${productId}`, {
        params: { _t: new Date().getTime() }
    })
    return responce.data
}

export async function addProductVariant(productId, newProductVariant) {
    const response = await productApiInstance.post(
        `/${productId}/variants`,
        newProductVariant
    );
    return response.data;
}

export async function updateVariantStock(productId, variantId, stock) {
    const response = await productApiInstance.patch(`/${productId}/variants/${variantId}/stock`, { stock });
    return response.data;
}

export async function deleteVariant(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`);
    return response.data;
}