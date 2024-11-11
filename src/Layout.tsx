// Layout.tsx
import React, { ReactNode } from "react";
import NavTabs from "./NavTabs";
import "./Layout.css";
import Logo from "./images/WPL.svg"

interface LayoutProps {
  children: ReactNode; // Define the type of the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <img src={Logo} alt="Wayback Public Library" className="logo" />
        </h1>
        <div className="nav-container">
          <NavTabs />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};


export default Layout;
