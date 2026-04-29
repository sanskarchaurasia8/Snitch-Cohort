import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router'; // or 'react-router-dom' depending on your project setup

const Nav = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Access cart items and auth state from Redux
    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.length;
    const { user, isAuthenticated } = useSelector((state) => state.auth || {});

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Categories', path: '/categories' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
                isScrolled
                    ? 'bg-[#131313]/80 backdrop-blur-md border-[#353534] shadow-sm py-3'
                    : 'bg-[#131313] border-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left: Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold tracking-widest text-[#E5E2E1] hover:text-[#F59E0B] transition-colors duration-300 uppercase">
                            SNITCH
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm uppercase tracking-widest text-[#d8c3ad] hover:text-[#F59E0B] transition-colors duration-300 font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user?.role === 'seller' && (
                            <Link
                                to="/seller/dashboard"
                                className="text-sm uppercase tracking-widest text-[#F59E0B] hover:text-[#FFC174] transition-colors duration-300 font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[1.5px] after:bg-[#F59E0B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Right: Actions (Cart, User/Login) */}
                    <div className="flex items-center space-x-6">
                        {/* Cart Icon */}
                        <Link to="/cart" className="relative group p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-[#E5E2E1] group-hover:text-[#F59E0B] transition-colors duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-[#131313] transform translate-x-1/4 -translate-y-1/4 bg-[#F59E0B] rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Icon / Login */}
                        <div className="hidden md:flex items-center">
                            {isAuthenticated || user ? (
                                <Link to="/dashboard" className="p-2 group">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-[#E5E2E1] group-hover:text-[#F59E0B] transition-colors duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-sm uppercase tracking-wider text-[#131313] bg-[#E5E2E1] hover:bg-[#F59E0B] hover:text-[#131313] px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-[#E5E2E1] hover:text-[#F59E0B] focus:outline-none p-2 transition-colors"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-[#131313] border-b border-[#353534] transition-all duration-300 overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-4 py-6 space-y-4 flex flex-col">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base uppercase tracking-widest text-[#d8c3ad] hover:text-[#F59E0B] transition-colors duration-300 font-medium block"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user?.role === 'seller' && (
                        <Link
                            to="/seller/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base uppercase tracking-widest text-[#F59E0B] hover:text-[#FFC174] transition-colors duration-300 font-bold block"
                        >
                            Dashboard
                        </Link>
                    )}
                    <div className="h-px w-full bg-[#353534] my-2"></div>
                    {isAuthenticated || user ? (
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base uppercase tracking-widest text-[#E5E2E1] hover:text-[#F59E0B] transition-colors duration-300 font-medium block"
                        >
                            My Account
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base uppercase tracking-widest text-[#F59E0B] font-semibold block"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;