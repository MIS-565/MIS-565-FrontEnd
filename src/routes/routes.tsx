import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Home";
import CheckoutPage from "../CheckoutPage";
import SearchPatron from "../searchPatron";
import AddPatronPage from "../AddPatronPage";
import Items from "../Items";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/searchPatron" element={<SearchPatron />} />
      <Route path="/CheckoutPage" element={<CheckoutPage />} />
      <Route path="/AddPatronPage" element={<AddPatronPage />} />
      <Route path="/items" element={<Items />} />
    </Routes>
  </Router>
);

export default AppRoutes;
