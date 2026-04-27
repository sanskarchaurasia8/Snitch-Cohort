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

export async function getAllProducts(){
    const responce = await productApiInstance.get("/")
    return responce.data
}

export async function getProductById(productId){
    const responce = await productApiInstance.get(`/detail/${productId}`)
    return responce.data
}