// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App"; // Adjust path if needed
import { Login } from "./components/login/login"; // Adjust path if needed
import { Register } from "./components/register/register"; // Adjust path if needed
import { AddGadgets } from "./components/add-gadgets/add-gadgets";
import { HowItWorks } from "./components/how-it-works/how-it-works";
import { ContactPage } from "./components/contact/contact"; // Adjust path if needed
import { EditProfile } from "./components/edit-profile/edit-profile"; // Adjust path if needed
import { Gadgets } from "./components/gadgets/gadgets";
import { FindPlace } from "./components/find-place/find-place";
import { PopularCamps } from "./components/popular-camps/popular-camps";
import { AdditionalServices } from "./components/additional-services/additional-services";
import { ScrollToTop } from "./utils/scroll-reset";
import { AdminDashboard } from "./components/admin-dashboard/admin-dashboard";
import { UserDashboard } from "./components/user-dashboard/user-dashboard";
import { EditGadget } from "./components/edit-gadget/edit-gadget";
import { EditReservation } from "./components/edit-reservation/edit-reservation";
import { GadgetReservation } from "./components/gadget-reservation/gadget-reservation";
import { Recenzie } from "./components/reviews/reviews";
import { SuccessPage } from "./components/success-page/success-page";
import { ErrorPage } from "./components/error-page/error-page";
import { ShowMorePage } from "./components/show-more/show-more";
import { Error404 } from "./components/error-page/404";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addgadgets" element={<AddGadgets />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/gadgets" element={<Gadgets />} />
        <Route path="/find-place" element={<FindPlace />} />
        <Route path="/popular-camps" element={<PopularCamps />} />
        <Route path="/additional-services" element={<AdditionalServices />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/show-more/:tableType" element={<ShowMorePage />} />
        <Route path="/edit-gadget/:gadgetId" element={<EditGadget />} />
        <Route path="/edit-reservation/:resId" element={<EditReservation />} />
        <Route path="/gadget-reservation/:gadgetId" element={<GadgetReservation />} />
        <Route path="/reviews" element={<Recenzie />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Error404 />} />


      </Routes>
    </BrowserRouter>
  </StrictMode>
);