import React , {useEffect} from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const {handleGetSellerProduct} = useProduct();
    const SellerProducts = useSelector(state => state.product.SellerProducts);
    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    console.log(SellerProducts);
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;