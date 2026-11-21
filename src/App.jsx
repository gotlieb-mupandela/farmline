import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Gallery from './pages/Gallery.jsx';
import Landing from './pages/Landing.jsx';
import { Splash, Onboarding, LanguageSelect, Login, Otp, Register } from './pages/farmer/Auth.jsx';
import FarmerHome from './pages/farmer/Home.jsx';
import { SellProduce, MyListings, ListingDetail, EditListing } from './pages/farmer/Listings.jsx';
import { BuyerRequests, FarmerOrders, FarmerOrderDetail } from './pages/farmer/Trade.jsx';
import { Wallet, Receipt, PriceInsights, FarmerNotifications } from './pages/farmer/Money.jsx';
import { Profile, FarmerSettings, Help } from './pages/farmer/Account.jsx';
import {
  AgentDashboard,
  AgentRegisterFarmer,
  AgentGrading,
  AgentCollections,
  AgentFarmers,
  AgentEarnings,
  AgentProfile,
} from './pages/agent/Agent.jsx';
import { BuyerLogin, BuyerSignup } from './pages/buyer/Auth.jsx';
import BuyerDashboard from './pages/buyer/Dashboard.jsx';
import { Marketplace, ProduceDetail } from './pages/buyer/Marketplace.jsx';
import { PostRequest, Checkout, BuyerOrders, BuyerOrderDetail } from './pages/buyer/Ordering.jsx';
import { Deliveries, Suppliers, Compliance, Payments, Analytics, Team, BuyerSettings } from './pages/buyer/Operations.jsx';
import { AdminOverview, AdminPeople } from './pages/admin/Admin.jsx';
import { AdminLayout, BuyerLayout, ComingSoon } from './components/web.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const SCREEN_TITLES = [
  [/^\/farmer/, 'FarmLine'],
  [/^\/agent/, 'FarmLine Agent'],
  [/^\/buyer/, 'FarmLine Buyer Portal'],
  [/^\/admin/, 'FarmLine Ops'],
];

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = SCREEN_TITLES.find(([re]) => re.test(pathname))?.[1] ?? 'FarmLine';
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/screens" element={<Gallery />} />

        {/* Farmer mobile app */}
        <Route path="/farmer" element={<Navigate to="/farmer/home" replace />} />
        <Route path="/farmer/splash" element={<Splash />} />
        <Route path="/farmer/onboarding" element={<Onboarding />} />
        <Route path="/farmer/language" element={<LanguageSelect />} />
        <Route path="/farmer/login" element={<Login />} />
        <Route path="/farmer/otp" element={<Otp />} />
        <Route path="/farmer/register" element={<Register />} />
        <Route path="/farmer/home" element={<FarmerHome />} />
        <Route path="/farmer/sell" element={<SellProduce />} />
        <Route path="/farmer/listings" element={<MyListings />} />
        <Route path="/farmer/listings/:id" element={<ListingDetail />} />
        <Route path="/farmer/listings/:id/edit" element={<EditListing />} />
        <Route path="/farmer/requests" element={<BuyerRequests />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/farmer/orders/:id" element={<FarmerOrderDetail />} />
        <Route path="/farmer/wallet" element={<Wallet />} />
        <Route path="/farmer/receipt/:id" element={<Receipt />} />
        <Route path="/farmer/prices" element={<PriceInsights />} />
        <Route path="/farmer/notifications" element={<FarmerNotifications />} />
        <Route path="/farmer/profile" element={<Profile />} />
        <Route path="/farmer/settings" element={<FarmerSettings />} />
        <Route path="/farmer/help" element={<Help />} />

        {/* Field agent app */}
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/register" element={<AgentRegisterFarmer />} />
        <Route path="/agent/grading" element={<AgentGrading />} />
        <Route path="/agent/farmers" element={<AgentFarmers />} />
        <Route path="/agent/collections" element={<AgentCollections />} />
        <Route path="/agent/earnings" element={<AgentEarnings />} />
        <Route path="/agent/profile" element={<AgentProfile />} />

        {/* Buyer web portal */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/signup" element={<BuyerSignup />} />
        <Route path="/buyer" element={<BuyerLayout />}>
          <Route index element={<BuyerDashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<ProduceDetail />} />
          <Route path="requests" element={<PostRequest />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="orders/:id" element={<BuyerOrderDetail />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="payments" element={<Payments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<BuyerSettings />} />
        </Route>

        {/* Ops admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="farmers" element={<AdminPeople initialTab="Farmers" />} />
          <Route path="agents" element={<AdminPeople initialTab="Agents" />} />
          <Route path="buyers" element={<ComingSoon title="Buyers" icon="storefront" />} />
          <Route path="orders" element={<ComingSoon title="Orders" icon="receipt_long" />} />
          <Route path="logistics" element={<ComingSoon title="Loads & logistics" icon="local_shipping" />} />
          <Route path="payments" element={<ComingSoon title="Payments" icon="payments" />} />
          <Route path="sms" element={<ComingSoon title="SMS logs" icon="sms" />} />
          <Route path="settings" element={<ComingSoon title="Settings" icon="settings" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
