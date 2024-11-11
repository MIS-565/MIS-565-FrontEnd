import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchPatron from "./searchPatron";
import CheckoutPage from "./CheckoutPage";
import Items from "./Items";
import Layout from "./Layout";
import { NextUIProvider } from "@nextui-org/react";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-patron" element={<SearchPatron />} />
            <Route path="/Check-out" element={<CheckoutPage />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </Layout>
      </Router>
    </NextUIProvider>
  );
};

export default App;
