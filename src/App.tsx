import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CheckoutPage from "./CheckoutPage";
import PatronPage from "./PatronPage";
import Items from "./Items";
import Layout from "./Layout";
import { NextUIProvider } from "@nextui-org/react";
import AddItem from "./AddItems";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patron" element={<PatronPage />} />
            <Route path="/Check-out" element={<CheckoutPage />} />
            <Route path="/items" element={<Items />} />
            <Route path="/add-items" element={<AddItem />} />
          </Routes>
        </Layout>
      </Router>
    </NextUIProvider>
  );
};

export default App;
