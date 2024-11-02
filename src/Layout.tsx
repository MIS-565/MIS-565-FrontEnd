// Layout.tsx
import React, { ReactNode } from "react";
import NavTabs from "./NavTabs";

interface LayoutProps {
  children: ReactNode; // Define the type of the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <h1
          style={{
            textAlign: "left",
            margin: 0,
            fontSize: "40px",
            color: "#f9f9f9",
            lineHeight: "1.5",
            paddingLeft: "10px",
            backgroundColor: "#4169E1",
          }}
        >
          Wayback Public Library <NavTabs />
        </h1>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
