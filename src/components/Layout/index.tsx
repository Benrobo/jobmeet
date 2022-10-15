import React, { useEffect, useState } from "react";
import { NavBar, Header, DomHead } from "..";
import SideBar from "../Navbar/sidebar";


type LayoutProps= {
  children: React.ReactNode
  sideBarActiveName: string;
}

function Layout({ sideBarActiveName, children }: LayoutProps) {
  return (
    <div className={`w-screen h-screen overflow-hidden`}>
      <DomHead />
      <div className="relative  flex flex-row items-start justify-start w-screen h-screen">
        <SideBar active={sideBarActiveName} />
        <div className="w-full h-screen overflow-y-scroll bg-dark-100">
          {/* user navbar profile */}
          
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
