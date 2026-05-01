import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items) || [];
    const { handleGetCart, handleIncrementCartItem, handleDecrementCartItem } = useCart();

    useEffect(() => {
        handleGetCart();
    }, []);

    // Helper to resolve the latest price dynamically from the populated product/variant
    const resolvePrice = (item) => {
        const product = item.product || {};
        const variant = product.varients?.find(v => v._id === item.variant) || null;
        
        // Priority: Variant -> Product -> Fallback to snapshot
        const latestPrice = variant?.price?.amount ?? product?.price?.amount ?? item.price?.amount ?? 0;
        const snapshotPrice = item.price?.amount ?? latestPrice;
        const currency = variant?.price?.currency ?? product?.price?.currency ?? item.price?.currency ?? 'INR';
        
        return { latestPrice, snapshotPrice, currency };
    };

    // Calculate subtotal dynamically using latest prices
    const subtotal = cartItems.reduce((acc, item) => {
        const { latestPrice } = resolvePrice(item);
        return acc + latestPrice * (item.quantity || 1);
    }, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-[#131313] text-[#E5E2E1] font-inter py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-semibold mb-8 tracking-tight">Shopping Bag</h1>
                
                {cartItems.length === 0 ? (
                    <div className="bg-[#1c1b1b] rounded-2xl p-8 text-center">
                        <p className="text-lg text-[#d8c3ad] mb-6">Your bag is empty.</p>
                        <button className="bg-gradient-to-br from-[#FFC174] to-[#F59E0B] text-[#472a00] px-8 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1 space-y-6">
                            {cartItems.map((item) => {
                                const product = item.product || {};
                                const variant = product.varients?.find(v => v._id === item.variant) || {};
                                const imageUrl = product.images?.[0]?.url || variant.images?.[0]?.url || 'https://via.placeholder.com/150';
                                
                                const { latestPrice, snapshotPrice, currency } = resolvePrice(item);
                                const isPriceReduced = latestPrice < snapshotPrice;
                                const isPriceIncreased = latestPrice > snapshotPrice;
                                const discountAmount = snapshotPrice - latestPrice;

                                return (
                                    <div key={item._id} className="bg-[#1c1b1b] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative group transition-colors duration-300 hover:bg-[#2a2a2a]">
                                        <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[#0e0e0e]">
                                            <img src={imageUrl} alt={product.title || "Product Image"} className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-medium text-[#E5E2E1] mb-1">{product.title}</h3>
                                            
                                            {variant.attributes && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {Object.entries(variant.attributes).map(([key, val]) => (
                                                        <span key={key} className="text-xs uppercase tracking-wider text-[#d8c3ad] bg-[#2a2a2a] px-2 py-1 rounded-full border border-[#353534]">
                                                            {key}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-end gap-3 mt-2">
                                                <div className={`text-xl font-semibold ${isPriceReduced ? 'text-emerald-400' : isPriceIncreased ? 'text-rose-400' : 'text-[#F59E0B]'}`}>
                                                    {currency === 'INR' ? '₹' : '$'}{latestPrice}
                                                </div>
                                                {isPriceReduced && (
                                                    <div className="text-sm text-neutral-500 line-through mb-0.5">
                                                        {currency === 'INR' ? '₹' : '$'}{snapshotPrice}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price Indicators */}
                                            {isPriceReduced && (
                                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                    Save {currency === 'INR' ? '₹' : '$'}{discountAmount}
                                                </div>
                                            )}
                                            {isPriceIncreased && (
                                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium tracking-wide">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                    Price increased
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                            <div className="flex items-center bg-[#0e0e0e] rounded-lg p-1 border border-[#353534]">
                                                <button 
                                                    onClick={() => handleDecrementCartItem(item.product._id, item.variant)}
                                                    disabled={item.quantity <= 1}
                                                    className={`w-8 h-8 flex items-center justify-center transition-colors rounded-md ${item.quantity <= 1 ? 'text-[#353534] cursor-not-allowed' : 'text-[#d8c3ad] hover:text-[#F59E0B] hover:bg-[#2a2a2a]'}`}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleIncrementCartItem(item.product._id, item.variant)}
                                                    className="w-8 h-8 flex items-center justify-center text-[#d8c3ad] hover:text-[#F59E0B] transition-colors rounded-md hover:bg-[#2a2a2a]"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            
                                            <button className="text-[#a08e7a] hover:text-[#ffb4ab] transition-colors p-2" title="Remove Item">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96 flex-shrink-0">
                            <div className="bg-[#1c1b1b] rounded-2xl p-8 sticky top-24">
                                <h2 className="text-2xl font-semibold mb-6 text-[#E5E2E1]">Order Summary</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-[#d8c3ad]">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#d8c3ad]">
                                        <span>Shipping</span>
                                        <span className="text-[#8fd5ff]">Free</span>
                                    </div>
                                    <div className="h-px bg-[#353534] my-4"></div>
                                    <div className="flex justify-between text-xl font-semibold text-[#E5E2E1]">
                                        <span>Total</span>
                                        <span className="text-[#F59E0B]">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-gradient-to-br from-[#FFC174] to-[#F59E0B] text-[#472a00] py-4 rounded-xl font-semibold text-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-[1.02]">
                                    Proceed to Checkout
                                </button>
                                
                                <p className="text-center text-xs text-[#a08e7a] mt-4 flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
