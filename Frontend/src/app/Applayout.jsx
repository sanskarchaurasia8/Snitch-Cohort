import React from "react";
import { Outlet } from "react-router";
import Nav from "../features/Shared/Components/Nav"

const Applayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#E5E2E1] font-inter">
            {/* The fixed Navbar */}
            <Nav />
            
            {/* 
              Main content wrapper: 
              - pt-24 gives 6rem (96px) of top padding to clear the fixed navbar.
              - flex-grow allows the main section to expand and fill the screen.
            */}
            <main className="flex-grow pt-24 pb-8">
                <Outlet />
            </main>
        </div>
    )
}

export default Applayout;