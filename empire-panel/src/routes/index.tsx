import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import BuyBot from "../pages/BuyBot";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
           <AppLayout />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/buy-normal" element={<BuyBot />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
