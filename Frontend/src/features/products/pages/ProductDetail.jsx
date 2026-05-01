import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from "../../cart/hook/useCart";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Variant State
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [activeVariant, setActiveVariant] = useState(null);

    const fetchProductDetail = useCallback(async (isBackgroundRefetch = false) => {
        if (!isBackgroundRefetch) {
            setIsLoading(true);
            setActiveVariant(null);
            setSelectedAttributes({});
        }
        
        const data = await handleGetProductById(productId);
        setProduct(data);

        if (isBackgroundRefetch) {
            // Update active variant with fresh data to reflect price changes
            setActiveVariant(prev => {
                if (!prev || !data.variants) return prev;
                return data.variants.find(v => v._id === prev._id) || prev;
            });
        } else {
            setIsLoading(false);
        }
    }, [handleGetProductById, productId]);

    useEffect(() => {
        fetchProductDetail(false); // Initial load
        
        // Polling mechanism to automatically catch direct database updates
        const intervalId = setInterval(() => {
            fetchProductDetail(true); // Background refresh
        }, 5000); // 5 seconds polling interval
        
        return () => clearInterval(intervalId);
    }, [fetchProductDetail]);

    useEffect(() => {
        setImageLoaded(false);
    }, [selectedImage]);

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0 && !activeVariant) {
            const firstVariant = product.variants[0];
            setActiveVariant(firstVariant);

            if (firstVariant.attributes) {
                const initialAttributes = {};
                if (Array.isArray(firstVariant.attributes)) {
                    firstVariant.attributes.forEach(attr => {
                        if (attr.key) initialAttributes[attr.key] = attr.value;
                    });
                } else {
                    Object.entries(firstVariant.attributes).forEach(([key, value]) => {
                        initialAttributes[key] = value;
                    });
                }
                setSelectedAttributes(initialAttributes);
            }
        }
    }, [product, activeVariant]);

    // Compute variants and attributes
    const variants = useMemo(() => product?.variants || [], [product]);

    const attributeKeys = useMemo(() => {
        const keys = new Set();
        variants.forEach(v => {
            if (v.attributes) {
                if (Array.isArray(v.attributes)) {
                    v.attributes.forEach(attr => {
                        if (attr.key) keys.add(attr.key);
                    });
                } else {
                    Object.keys(v.attributes).forEach(k => keys.add(k));
                }
            }
        });
        return Array.from(keys);
    }, [variants]);

    const attributeOptions = useMemo(() => {
        const options = {};
        attributeKeys.forEach(key => {
            const values = new Set();
            variants.forEach(v => {
                if (v.attributes) {
                    if (Array.isArray(v.attributes)) {
                        const attr = v.attributes.find(a => a.key === key);
                        if (attr) values.add(attr.value);
                    } else if (v.attributes[key]) {
                        values.add(v.attributes[key]);
                    }
                }
            });
            options[key] = Array.from(values);
        });
        return options;
    }, [variants, attributeKeys]);

    const handleAttributeSelect = (key, value) => {
        const newSelected = { ...selectedAttributes, [key]: value };

        // 1. Try to find a variant that exactly matches ALL selected attributes
        let matchingVariant = variants.find(v => {
            return Object.entries(newSelected).every(([k, val]) => {
                if (!v.attributes) return false;
                if (Array.isArray(v.attributes)) {
                    return v.attributes.some(attr => attr.key === k && attr.value === val);
                }
                return v.attributes[k] === val;
            });
        });

        // 2. If no exact match (e.g. clicking Black but current size M doesn't exist in Black),
        // find the first variant that matches the newly clicked attribute.
        if (!matchingVariant) {
            matchingVariant = variants.find(v => {
                if (!v.attributes) return false;
                if (Array.isArray(v.attributes)) {
                    return v.attributes.some(attr => attr.key === key && attr.value === value);
                }
                return v.attributes[key] === value;
            });

            // 3. Sync the selected attributes to this new valid variant so the UI reflects reality
            if (matchingVariant && matchingVariant.attributes) {
                if (Array.isArray(matchingVariant.attributes)) {
                    matchingVariant.attributes.forEach(attr => {
                        if (attr.key) newSelected[attr.key] = attr.value;
                    });
                } else {
                    Object.entries(matchingVariant.attributes).forEach(([k, v]) => {
                        newSelected[k] = v;
                    });
                }
            }
        }

        // 4. Update states
        setSelectedAttributes(newSelected);
        if (matchingVariant) {
            setActiveVariant(matchingVariant);
            setSelectedImage(0); // Reset image selection
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase font-light">
                        Loading
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-neutral-400 text-lg mb-4">Product not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-amber-400 hover:text-amber-300 text-sm tracking-[0.15em] uppercase transition-colors duration-300"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    }

    console.log(product)

    // Compute Display Data (Fallback to product if variant missing data)
    const displayImages = (activeVariant?.images?.length > 0) ? activeVariant.images : (product.images || []);
    const currentImage = displayImages[selectedImage]?.url;
    const isOutOfStock = activeVariant ? activeVariant.stock === 0 : false;
    
    // Dynamic Pricing Logic (Strictly variant.price -> product.price)
    const displayCurrentPrice = activeVariant?.price?.amount ?? product?.price?.amount ?? 0;
    const displayCurrency = activeVariant?.price?.currency ?? product?.price?.currency ?? 'INR';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-['Inter',sans-serif]">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors duration-300"
                    >
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span className="text-xs tracking-[0.2em] uppercase font-semibold">Back</span>
                    </button>
                    <div className="text-amber-500 font-bold tracking-[0.3em] text-lg">SNITCH</div>
                    <div className="w-16"></div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* ─── Left Column: Image Gallery ─── */}
                    <div className="flex flex-row gap-4">
                        {/* Vertical Thumbnail Strip */}
                        {displayImages.length > 1 && (
                            <div className="flex flex-col gap-3 flex-shrink-0">
                                {displayImages.map((img, index) => (
                                    <button
                                        key={img._id || index}
                                        onClick={() => {
                                            setImageLoaded(false);
                                            setSelectedImage(index);
                                        }}
                                        className={`relative w-16 h-20 lg:w-20 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer
                                            ${selectedImage === index
                                                ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                                                : 'border-neutral-800/60 hover:border-neutral-600 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedImage === index && (
                                            <div className="absolute inset-0 border-2 border-amber-400 rounded-[10px]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative aspect-[4/5] flex-1 min-w-0 overflow-hidden rounded-2xl bg-[#111111] border border-neutral-800/40 group">
                            {currentImage && (
                                <>
                                    <img
                                        key={selectedImage}
                                        src={currentImage}
                                        alt={`${product.title} — view ${selectedImage + 1}`}
                                        onLoad={() => setImageLoaded(true)}
                                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out
                                            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                    />
                                    {/* Subtle gradient overlay at bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none" />

                                    {/* Previous / Next buttons */}
                                    {displayImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setImageLoaded(false);
                                                    setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
                                                }}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                                                    bg-black/40 backdrop-blur-md border border-neutral-700/50
                                                    flex items-center justify-center
                                                    text-neutral-300 hover:text-amber-400 hover:border-amber-400/40
                                                    opacity-0 group-hover:opacity-100
                                                    transition-all duration-300 cursor-pointer"
                                                aria-label="Previous image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setImageLoaded(false);
                                                    setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                                                    bg-black/40 backdrop-blur-md border border-neutral-700/50
                                                    flex items-center justify-center
                                                    text-neutral-300 hover:text-amber-400 hover:border-amber-400/40
                                                    opacity-0 group-hover:opacity-100
                                                    transition-all duration-300 cursor-pointer"
                                                aria-label="Next image"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </button>
                                        </>
                                    )}

                                    {/* Image counter badge */}
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 text-[11px] tracking-[0.15em] text-neutral-300 border border-neutral-700/50">
                                        {selectedImage + 1} / {displayImages.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ─── Right Column: Product Info ─── */}
                    <div className="flex flex-col justify-center lg:py-8">
                        {/* Category / Breadcrumb hint */}
                        <p className="text-[11px] tracking-[0.25em] uppercase text-amber-400/60 mb-3 font-light">
                            Premium Collection
                        </p>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-50 leading-tight mb-4">
                            {product.title}
                        </h1>

                        {/* Divider */}
                        <div className="w-12 h-px bg-gradient-to-r from-amber-400/80 to-transparent mb-6" />

                        {/* Price */}
                        <div className="mb-6 flex flex-col gap-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-light tracking-tight text-amber-400">
                                    {displayCurrency === 'INR' ? '₹' : '$'}{displayCurrentPrice?.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-light">
                            {product.description}
                        </p>

                        {/* Subtle product meta */}
                        <div className="flex items-center gap-4 mb-8 text-[11px] tracking-[0.15em] text-neutral-500 uppercase">
                            <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'} inline-block`} />
                                {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                            </span>
                            <span className="w-px h-3 bg-neutral-700" />
                            <span>Free Delivery</span>
                        </div>

                        {/* Variant Attributes Selection */}
                        {attributeKeys.map(key => (
                            <div key={key} className="mb-6">
                                <h3 className="text-sm tracking-[0.15em] uppercase text-neutral-400 mb-3">{key}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {attributeOptions[key].map(value => {
                                        const isSelected = selectedAttributes[key] === value;
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => handleAttributeSelect(key, value)}
                                                className={`px-4 py-2 rounded-lg text-sm tracking-wide border transition-all duration-300 cursor-pointer
                                                    ${isSelected
                                                        ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                                                        : 'border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'}`}
                                            >
                                                {value}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* ─── Action Buttons ─── */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Add to Cart */}
                            <button
                                id="add-to-cart-btn"
                                className="group relative flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl
                                    border border-amber-400/40 text-amber-400 bg-amber-400/5
                                    hover:bg-amber-400/10 hover:border-amber-400/70 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]
                                    active:scale-[0.98]
                                    transition-all duration-300 cursor-pointer"

                                onClick={async () => {
                                    if (!activeVariant) {
                                        alert("Please select a variant.");
                                        return;
                                    }
                                    try {
                                        const currentProductId = product?._id || productId;
                                        await handleAddItem(currentProductId, activeVariant._id, 1);
                                        alert("Product added to cart!");
                                    } catch (error) {
                                        console.error("Add to cart failed:", error.response?.data || error);
                                        const errorMessage = error.response?.data?.message || error?.message || "Failed to add to cart.";
                                        
                                        if (errorMessage.toLowerCase().includes("unauthorized") || error.response?.status === 401) {
                                            navigate('/login');
                                        } else {
                                            alert(errorMessage);
                                        }
                                    }
                                }}
                            >
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.572M7.5 14.25h9m-9 0a3 3 0 01-5.98-.572M16.5 14.25a3 3 0 005.98.572M16.5 14.25h-9m9 0a3 3 0 015.98-.572M7.5 14.25L5.106 5.272M16.5 14.25l2.394-8.978M5.106 5.272H19.894" />
                                </svg>
                                <span className="text-sm tracking-[0.15em] uppercase font-medium">
                                    Add to Cart
                                </span>
                            </button>

                            {/* Buy Now */}
                            <button
                                id="buy-now-btn"
                                className="group relative flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl
                                    bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a0a0a]
                                    hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_8px_40px_rgba(251,191,36,0.25)]
                                    active:scale-[0.98]
                                    transition-all duration-300 cursor-pointer"
                            >
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                                <span className="text-sm tracking-[0.15em] uppercase font-semibold">
                                    Buy Now
                                </span>
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-800/40">
                            <div className="flex flex-col items-center gap-2 py-3">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 text-center">
                                    Authentic
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-3">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-1.036-.84-1.875-1.875-1.875H19.5m-14.25 0h14.25m-14.25 0v-7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v7.5" />
                                </svg>
                                <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 text-center">
                                    Free Shipping
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 py-3">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 14.652" />
                                </svg>
                                <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 text-center">
                                    Easy Returns
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;