import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchPatron from "./searchPatron";
import CheckoutPage from "./CheckoutPage";
import Layout from "./Layout";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-patron" element={<SearchPatron />} />
          <Route path="/Check-out" element={<CheckoutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
