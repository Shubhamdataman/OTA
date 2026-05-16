
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import DmLayout from "../components/DmLayout";
import SignUp from "../pages/SignUp";
import HotelDetail from "../pages/HotelDetail";
import Checkout from "../pages/Checkout";
import RazorpayPayment from "../components/Payment/RazorpayPayment";

function AppRoutes() {
  return (
    <BrowserRouter basename="/ota">
      <Routes>
        <Route path="/*" element={
          <DmLayout>
            <Home />
          </DmLayout>
        } />
        <Route path="/detail" element={
          <DmLayout>
            <HotelDetail />
          </DmLayout>
        } />
         <Route path="/checkout" element={
          <DmLayout>
            <Checkout />
          </DmLayout>
        } />
        <Route path="/payment" element={
          <DmLayout>
            <RazorpayPayment />
            </DmLayout>
        } />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
