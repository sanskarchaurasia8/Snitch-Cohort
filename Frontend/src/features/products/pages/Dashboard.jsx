import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

/**
 * Seller Dashboard — Snitch Clothing Platform
 * Theme: Aurelian Noir — Golden Yellow (#F59E0B) on Deep Dark (#0D0D0D).
 * Displays seller's products in a premium card grid with stats overview.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { handleGetSellerProduct } = useProduct();
    const SellerProducts = useSelector(state => state.product.SellerProducts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleGetSellerProduct().finally(() => setIsLoading(false));
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

    // ── Stats ──────────────────────────────────────────────────────────────
    const totalProducts = SellerProducts.length;
    const totalImages = SellerProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0);
    const avgPrice = totalProducts > 0
        ? (SellerProducts.reduce((sum, p) => sum + (p.price?.amount || 0), 0) / totalProducts).toFixed(0)
        : 0;

    const stats = [
        { label: "Products", value: totalProducts, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
        { label: "Total Images", value: totalImages, icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
        { label: "Avg. Price", value: `₹${avgPrice}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" },
    ];

    // ── Shared styles ──────────────────────────────────────────────────────
    const metaLabel = "text-[#D8C3AD]/30 text-[9px] tracking-[0.3em] uppercase font-medium";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-[#F59E0B]/30 border-t-[#F59E0B] rounded-full animate-spin" />
                    <span className={metaLabel}>Loading your products</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-['Inter'] relative overflow-x-hidden">

            {/* Ambient glows */}
            <div className="pointer-events-none absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#F59E0B]/[0.05] blur-[180px] rounded-full" />
            <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#F59E0B]/[0.03] blur-[140px] rounded-full" />

            {/* ── Nav ──────────────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#F59E0B]/[0.06]">
                <div className="max-w-screen-xl mx-auto px-6 sm:px-10 xl:px-20 py-5 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-[#D8C3AD]/50 hover:text-[#F59E0B] transition-colors duration-300 group"
                        aria-label="Go home"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Home</span>
                    </button>

                    <span className="text-white font-bold tracking-[0.25em] text-lg lg:text-xl">SNITCH</span>

                    <Link
                        to="/seller/create-product"
                        className="flex items-center gap-2 text-[#0D0D0D] bg-[#F59E0B] hover:bg-[#F59E0B]/90 px-4 py-2 rounded-lg font-semibold text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-[0_0_30px_-6px_rgba(245,158,11,0.5)]"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Product
                    </Link>
                </div>
            </nav>

            {/* ── Main ─────────────────────────────────────────────────────── */}
            <main className="max-w-screen-xl mx-auto px-6 sm:px-10 xl:px-20 py-12 lg:py-16">

                {/* Page header */}
                <header className="mb-12 lg:mb-16">
                    <p className="text-[#D8C3AD]/40 text-[10px] tracking-[0.25em] uppercase font-medium mb-3">
                        Seller Portal
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.05]">
                        Your <span className="font-semibold text-[#F59E0B]">Dashboard</span>
                    </h1>
                    <div className="w-12 h-[1.5px] bg-[#F59E0B]/50 mt-5 rounded-full" />
                </header>

                {/* ── Stats Row ───────────────────────────────────────────── */}
                {totalProducts > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 lg:mb-16">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-[#1C1B1B]/60 border border-[#534434]/15 rounded-2xl p-6 flex items-center gap-5 group hover:border-[#F59E0B]/20 transition-colors duration-500"
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F59E0B]/[0.12] transition-colors duration-500">
                                    <svg className="w-5 h-5 text-[#F59E0B]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-white tracking-tight">{stat.value}</p>
                                    <p className={metaLabel}>{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Content ─────────────────────────────────────────────── */}
                {totalProducts === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-[#1C1B1B]/80 border border-[#534434]/20 flex items-center justify-center mb-8">
                            <svg className="w-9 h-9 text-[#D8C3AD]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-light text-white mb-3 tracking-tight">
                            No Products <span className="text-[#D8C3AD]/40">Yet</span>
                        </h2>
                        <p className="text-[#D8C3AD]/30 text-sm max-w-xs mb-10 leading-relaxed">
                            Start building your catalogue by adding your first product to the Snitch marketplace.
                        </p>
                        <Link
                            to="/seller/create-product"
                            className="relative overflow-hidden group bg-[#F59E0B] text-[#472A00] px-8 py-4 rounded-xl font-bold text-sm tracking-[0.12em] uppercase hover:shadow-[0_0_50px_-8px_rgba(245,158,11,0.55)] active:scale-[0.98] transition-all duration-300"
                        >
                            <span className="relative z-10">Add Your First Product</span>
                            <div className="absolute inset-0 bg-white/[0.15] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Section header */}
                        <div className="flex items-center justify-between mb-8">
                            <p className={metaLabel}>Your Products</p>
                            <span className="text-[#F59E0B]/60 bg-[#F59E0B]/[0.08] px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] uppercase">
                                {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
                            </span>
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {SellerProducts.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => navigate(`/seller/product/${product._id}`)}
                                    className="group bg-[#1C1B1B]/60 border border-[#534434]/15 rounded-2xl overflow-hidden cursor-pointer hover:border-[#F59E0B]/20 hover:shadow-[0_8px_40px_-12px_rgba(245,158,11,0.15)] transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="aspect-square bg-[#151414] relative overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0].url}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-10 h-10 text-[#D8C3AD]/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Image count badge */}
                                        <div className="absolute top-3 right-3 bg-[#0D0D0D]/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#D8C3AD]/60 tracking-wider">
                                            {product.images?.length || 0} img
                                        </div>

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="font-semibold text-white/90 truncate mb-1.5 text-[15px] tracking-tight group-hover:text-[#F59E0B] transition-colors duration-300">
                                            {product.title}
                                        </h3>
                                        <p className="text-[#D8C3AD]/25 text-xs line-clamp-2 mb-4 leading-relaxed font-light">
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-lg font-bold text-[#F59E0B] tracking-tight">
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-[#534434]/15">
                                            <span className="text-[10px] text-[#D8C3AD]/20 tracking-wider uppercase">
                                                {formatDate(product.createdAt)}
                                            </span>
                                            <span className="text-[10px] text-[#F59E0B]/50 font-semibold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                View →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
