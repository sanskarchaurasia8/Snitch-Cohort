import React, {useEffect} from "react"
import {useSelector} from "react-redux"
import { useProduct } from "../hooks/useProduct"
import { useNavigate } from "react-router"


const Home = ()=> {
    const products = useSelector(state => state.product.products)
    const {handleGetAllProducts} = useProduct()
    const navigate = useNavigate()

    useEffect(() =>{
        handleGetAllProducts()
    }, [])

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>All Products</h1>
            {products.length === 0 ? (
                <p style={styles.noProducts}>No products available</p>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <div key={product._id} style={styles.card}>
                            <img 
                                src={product.images?.[0]?.url || "https://via.placeholder.com/300"} 
                                alt={product.title}
                                style={styles.image}
                                onClick={()=> navigate(`/product/${product._id}`)}
                            />
                            <div style={styles.cardContent}>
                                <h3 style={styles.title}>{product.title}</h3>
                                <p style={styles.description}>{product.description}</p>
                                <p style={styles.price}>
                                    {product.price?.currency} {product.price?.amount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    heading: {
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "2rem",
        color: "#333"
    },
    noProducts: {
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#666"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px"
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s"
    },
    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover"
    },
    cardContent: {
        padding: "15px"
    },
    title: {
        margin: "0 0 10px 0",
        fontSize: "1.2rem",
        color: "#333"
    },
    description: {
        margin: "0 0 10px 0",
        fontSize: "0.9rem",
        color: "#666",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    price: {
        margin: "0",
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: "#2ecc71"
    }
}

export default Home 