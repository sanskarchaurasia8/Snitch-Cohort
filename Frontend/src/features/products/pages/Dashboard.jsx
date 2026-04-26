import React, {useEffect} from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const Dashboard = () => {
    const {handleGetSellerProduct} = useProduct();
    const SellerProducts = useSelector(state => state.product.SellerProducts);
    
    useEffect(() => {
        handleGetSellerProduct();
    }, [handleGetSellerProduct]);

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: price.currency || 'INR'
        }).format(price.amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your products and inventory</p>
                </div>
                <Link 
                    to="/products/create" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Product
                </Link>
            </div>

            {SellerProducts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
                    <p className="text-gray-500 mb-6">Start selling by adding your first product</p>
                    <Link 
                        to="/products/create" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Your Products</h2>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {SellerProducts.length} {SellerProducts.length === 1 ? 'Product' : 'Products'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {SellerProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-gray-100 relative">
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={product.images[0].url} 
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                                        {product.images?.length || 0} images
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate mb-1">{product.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                        <span>Created: {formatDate(product.createdAt)}</span>
                                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;