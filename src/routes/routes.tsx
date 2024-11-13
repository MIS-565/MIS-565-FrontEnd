import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Home";
import CheckoutPage from "../CheckoutPage";
import PatronPage from "../PatronPage";
import Items from "../Items";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patron" element={<PatronPage />} />
      <Route path="/CheckoutPage" element={<CheckoutPage />} />
      <Route path="/items" element={<Items />} />
    </Routes>
  </Router>
);

export default AppRoutes;
