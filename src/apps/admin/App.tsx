import { Switch, Route, Router as WouterRouter } from "@/lib/wouter";
import { useState } from "react";
import { Sidebar } from "@/apps/admin/components/sidebar";
import LoginPage from "@/apps/admin/pages/login";
import Dashboard from "@/apps/admin/pages/dashboard";
import WisataPage from "@/apps/admin/pages/wisata";
import KulinerPage from "@/apps/admin/pages/kuliner";
import CafePage from "@/apps/admin/pages/cafe";
import PenginapanPage from "@/apps/admin/pages/penginapan";
import EventsPage from "@/apps/admin/pages/events";
import BeritaPage from "@/apps/admin/pages/berita";
import SiteSettingsPage from "@/apps/admin/pages/site-settings";
import VouchersPage from "@/apps/admin/pages/vouchers";
import KamusSundaPage from "@/apps/admin/pages/kamus-sunda";
import TransportasiPage from "@/apps/admin/pages/transportasi";
import PriceListPage from "@/apps/admin/pages/price-list";
import PartnershipPage from "@/apps/admin/pages/partnership";
import DigitalServicesPage from "@/apps/admin/pages/digital-services";
import BannersPage from "@/apps/admin/pages/banners";
import PromoBannersPage from "@/apps/admin/pages/promo-banners";
import PartnersPage from "@/apps/admin/pages/partners";
import NotificationsPage from "@/apps/admin/pages/notifications";
import UsersPage from "@/apps/admin/pages/users";
import MitraPage from "@/apps/admin/pages/mitra";
import PasswordResetRequestsPage from "@/apps/admin/pages/password-reset-requests";
import DeleteAccountRequestsPage from "@/apps/admin/pages/delete-account-requests";
import UserActivitiesPage from "@/apps/admin/pages/user-activities";
import ReviewsPage from "@/apps/admin/pages/reviews";
import DonationsPage from "@/apps/admin/pages/donations";
import UserRewardsPage from "@/apps/admin/pages/user-rewards";
import EventOrdersPage from "@/apps/admin/pages/event-orders";
import JajanYukPage from "@/apps/admin/pages/jajan-yuk";
import TicketScannerPage from "@/apps/admin/pages/ticket-scanner";
import BpjsRegistrationsPage from "@/apps/admin/pages/bpjs-registrations";
import WithdrawalsPage from "@/apps/admin/pages/withdrawals";
import InfluencersPage from "@/apps/admin/pages/influencers";
import TalentAdminPage from "@/apps/admin/pages/talent";
import TalentPortfolioPage from "@/apps/admin/pages/talent-portfolio";
import TalentBannerPage from "@/apps/admin/pages/talent-banner";
import InfluencerBannerPhotosPage from "@/apps/admin/pages/influencer-banner-photos";
import EmailFailuresPage from "@/apps/admin/pages/email-failures";
import BackupPage from "@/apps/admin/pages/backup";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <p className="text-lg font-medium">Halaman tidak ditemukan</p>
    </div>
  );
}

function AdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-7 sm:px-6 sm:pt-20 lg:px-6 lg:py-7">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/wisata" component={WisataPage} />
            <Route path="/kuliner" component={KulinerPage} />
            <Route path="/cafe" component={CafePage} />
            <Route path="/penginapan" component={PenginapanPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/event-orders" component={EventOrdersPage} />
            <Route path="/jajan-yuk" component={JajanYukPage} />
            <Route path="/ticket-scanner" component={TicketScannerPage} />
            <Route path="/berita" component={BeritaPage} />
            <Route path="/vouchers" component={VouchersPage} />
            <Route path="/kamus-sunda" component={KamusSundaPage} />
            <Route path="/transportasi" component={TransportasiPage} />
            <Route path="/price-list" component={PriceListPage} />
            <Route path="/partnership" component={PartnershipPage} />
            <Route path="/digital-services" component={DigitalServicesPage} />
            <Route path="/banners" component={BannersPage} />
            <Route path="/promo-banners" component={PromoBannersPage} />
            <Route path="/partners" component={PartnersPage} />
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/users" component={UsersPage} />
            <Route path="/mitra" component={MitraPage} />
            <Route path="/password-reset-requests" component={PasswordResetRequestsPage} />
            <Route path="/delete-account-requests" component={DeleteAccountRequestsPage} />
            <Route path="/user-activities" component={UserActivitiesPage} />
            <Route path="/reviews" component={ReviewsPage} />
            <Route path="/donations" component={DonationsPage} />
            <Route path="/user-rewards" component={UserRewardsPage} />
            <Route path="/bpjs-registrations" component={BpjsRegistrationsPage} />
            <Route path="/withdrawals" component={WithdrawalsPage} />
            <Route path="/influencers" component={InfluencersPage} />
            <Route path="/talent" component={TalentAdminPage} />
            <Route path="/talent-portfolio" component={TalentPortfolioPage} />
            <Route path="/talent-banner" component={TalentBannerPage} />
            <Route path="/influencer-banner-photos" component={InfluencerBannerPhotosPage} />
            <Route path="/email-failures" component={EmailFailuresPage} />
            <Route path="/backup" component={BackupPage} />
            <Route path="/settings" component={SiteSettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("nempo_admin_token"));

  function handleLogout() {
    localStorage.removeItem("nempo_admin_token");
    localStorage.removeItem("nempo_admin_user");
    setToken(null);
  }

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return (
    <WouterRouter base={"/admin-panel/".replace(/\/$/, "")}>
      <AdminLayout onLogout={handleLogout} />
    </WouterRouter>
  );
}
