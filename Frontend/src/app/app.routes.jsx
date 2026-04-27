import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";



export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/product/:productId",
        element: <ProductDetail />,
    },
    {
        path: "/seller",
        children: [
            {
                path: "/seller/create-product",
                element: <CreateProduct />,
            },
            {
                path: "/seller/dashboard",
                element: <Dashboard />,
            }
        ]
    }
])
