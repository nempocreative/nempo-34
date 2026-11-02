import { Switch, Route, Router as WouterRouter, useLocation } from "@/lib/wouter";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleAuthProvider } from "@/contexts/google-auth-context";
import { DarkModeProvider } from "@/contexts/dark-mode-context";
import { AuthProvider } from "@/contexts/auth-context";
import { MatchProvider } from "@/contexts/match-context";
import { PancoProvider } from "@/contexts/panco-context";
import { CityFilterProvider } from "@/contexts/city-filter-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { NetworkStatus } from "@/components/network-status";
import { JingleMiniPlayer } from "@/components/jingle-mini-player";

const Splash = lazyWithRetry(() => import("@/pages/splash"));
const Home = lazyWithRetry(() => import("@/pages/home"));
const WishlistPage = lazyWithRetry(() => import("@/pages/wishlist"));
const EventPage = lazyWithRetry(() => import("@/pages/event"));
const NempoCulturalTourPage = lazyWithRetry(() => import("@/pages/nempo-cultural-tour"));
const EventDetail = lazyWithRetry(() => import("@/pages/event-detail"));
const EventCheckout = lazyWithRetry(() => import("@/pages/event-checkout"));
const KulinerPage = lazyWithRetry(() => import("@/pages/kuliner"));
const KulinerDetail = lazyWithRetry(() => import("@/pages/kuliner-detail"));
const WarungPage = lazyWithRetry(() => import("@/pages/warung"));
const CafePage = lazyWithRetry(() => import("@/pages/cafe"));
const JajanYukPage = lazyWithRetry(() => import("@/pages/jajan-yuk-market"));
const JajanYukMenuPage = lazyWithRetry(() => import("@/pages/jajan-yuk-menu"));
const JajanYukTrackPage = lazyWithRetry(() => import("@/pages/jajan-yuk-track"));
const WisataPage = lazyWithRetry(() => import("@/pages/wisata"));
const WisataDetail = lazyWithRetry(() => import("@/pages/wisata-detail"));
const PenginapanPage = lazyWithRetry(() => import("@/pages/penginapan"));
const PenginapanDetail = lazyWithRetry(() => import("@/pages/penginapan-detail"));
const TiketPage = lazyWithRetry(() => import("@/pages/tiket"));
const CekTiketPage = lazyWithRetry(() => import("@/pages/cek-tiket"));
const RentCarPage = lazyWithRetry(() => import("@/pages/rent-car"));
const KomunitasPage = lazyWithRetry(() => import("@/pages/komunitas"));
const RecruitmentPage = lazyWithRetry(() => import("@/pages/recruitment"));
const PortofolioPage = lazyWithRetry(() => import("@/pages/portofolio"));
const ContactPage = lazyWithRetry(() => import("@/pages/contact"));
const AdventureGearPage = lazyWithRetry(() => import("@/pages/adventure-gear"));
const KamusSundaPage = lazyWithRetry(() => import("@/pages/kamus-sunda"));
const ProfilePage = lazyWithRetry(() => import("@/pages/profile"));
const ChangePasswordPage = lazyWithRetry(() => import("@/pages/profile-change-password"));
const ForgotPasswordPage = lazyWithRetry(() => import("@/pages/forgot-password"));
const DeleteAccountPage = lazyWithRetry(() => import("@/pages/profile-delete-account"));
const KeranjangPage = lazyWithRetry(() => import("@/pages/keranjang"));
const PesananSayaPage = lazyWithRetry(() => import("@/pages/pesanan-saya"));
const LoginPage = lazyWithRetry(() => import("@/pages/login"));
const RegisterPage = lazyWithRetry(() => import("@/pages/register"));
const ThanksPage = lazyWithRetry(() => import("@/pages/thanks"));
const VoucherListPage = lazyWithRetry(() => import("@/pages/voucherlist"));
const PoinPage = lazyWithRetry(() => import("@/pages/poin"));
const CouponsPage = lazyWithRetry(() => import("@/pages/coupons"));
const PaymentPage = lazyWithRetry(() => import("@/pages/payment"));
const PembayaranPage = lazyWithRetry(() => import("@/pages/pembayaran"));
const VerifyPage = lazyWithRetry(() => import("@/pages/verify"));
const DigitalServicesPage = lazyWithRetry(() => import("@/pages/digital-services"));
const DigitalSuperAppDemoPage = lazyWithRetry(() => import("@/pages/digital-super-app-demo"));
const DigitalTicketingDemoPage = lazyWithRetry(() => import("@/pages/digital-ticketing-demo"));
const DigitalKasirDemoPage = lazyWithRetry(() => import("@/pages/digital-kasir-demo"));
const DigitalQueueDemoPage = lazyWithRetry(() => import("@/pages/digital-queue-demo"));
const DigitalBookingDemoPage = lazyWithRetry(() => import("@/pages/digital-booking-demo"));
const DigitalPurchasingDemoPage = lazyWithRetry(() => import("@/pages/digital-purchasing-demo"));
const DigitalLoyaltyDemoPage = lazyWithRetry(() => import("@/pages/digital-loyalty-demo"));
const DigitalWarehouseDemoPage = lazyWithRetry(() => import("@/pages/digital-warehouse-demo"));
const DigitalInvitationDemoPage = lazyWithRetry(() => import("@/pages/digital-invitation-demo"));
const DigitalCompanyDemoPage = lazyWithRetry(() => import("@/pages/digital-company-demo"));
const DigitalYearbookDemoPage = lazyWithRetry(() => import("@/pages/digital-yearbook-demo"));
const DigitalMarketingDemoPage = lazyWithRetry(() => import("@/pages/digital-marketing-demo"));
const DigitalQrMenuDemoPage = lazyWithRetry(() => import("@/pages/digital-qr-menu-demo"));
const DigitalQrMenuCustomerPage = lazyWithRetry(() => import("@/pages/digital-qr-menu-demo").then((module) => ({ default: module.QrMenuCustomerPage })));
const DigitalCrmDemoPage = lazyWithRetry(() => import("@/pages/digital-crm-demo"));
const DigitalInvoiceDemoPage = lazyWithRetry(() => import("@/pages/digital-invoice-demo"));
const DigitalDapurStockDemoPage = lazyWithRetry(() => import("@/pages/digital-dapur-stock-demo"));
const DigitalHppDemoPage = lazyWithRetry(() => import("@/pages/digital-hpp-demo"));
const DigitalRecipeDemoPage = lazyWithRetry(() => import("@/pages/digital-recipe-demo"));
const DigitalHumanResourceDemoPage = lazyWithRetry(() => import("@/pages/digital-human-resource-demo"));
const DigitalLinkBioDemoPage = lazyWithRetry(() => import("@/pages/digital-link-bio-demo"));
const InfluencerHubPage = lazyWithRetry(() => import("@/pages/influencer-hub"));
const SponsorshipPage = lazyWithRetry(() => import("@/pages/sponsorship"));
const SponsorshipEventPage = lazyWithRetry(() => import("@/pages/sponsorship-event"));
const HalloweenProposalPage = lazyWithRetry(() => import("@/pages/sponsorship-proposal"));
const EventOrganizerPage = lazyWithRetry(() => import("@/pages/event-organizer"));
const WeddingOrganizerPage = lazyWithRetry(() => import("@/pages/wedding-organizer"));
const InvitationDemoPage = lazyWithRetry(() => import("@/pages/invitation-demo"));
const WeddingInvitationPage = lazyWithRetry(() => import("@/pages/wedding-invitation"));
const BusinessSystemPage = lazyWithRetry(() => import("@/pages/business-system"));
const DesignCreativePage = lazyWithRetry(() => import("@/pages/design-creative"));
const WebDevelopmentPage = lazyWithRetry(() => import("@/pages/web-development"));
const SosmedManagementPage = lazyWithRetry(() => import("@/pages/sosmed-management"));
const PriceListPage = lazyWithRetry(() => import("@/pages/price-list"));
const DonasiBibitPage = lazyWithRetry(() => import("@/pages/donasi-bibit"));
const TalentPage = lazyWithRetry(() => import("@/pages/talent-management"));
const MerchandisePage = lazyWithRetry(() => import("@/pages/merchandise"));
const SettingsPage = lazyWithRetry(() => import("@/pages/settings"));
const ItineraryPage = lazyWithRetry(() => import("@/pages/itinerary"));
const ItineraryComingSoonPage = lazyWithRetry(() => import("@/pages/itinerary-coming-soon"));
const EditProfilPage = lazyWithRetry(() => import("@/pages/edit-profil"));
const UlasanPage = lazyWithRetry(() => import("@/pages/ulasan"));
const NotifikasiPage = lazyWithRetry(() => import("@/pages/notifikasi"));
const ReferralPage = lazyWithRetry(() => import("@/pages/referral"));
const BantuanPage = lazyWithRetry(() => import("@/pages/bantuan"));
const TosPage = lazyWithRetry(() => import("@/pages/tos"));
const CariPage = lazyWithRetry(() => import("@/pages/cari"));
const ComingSoonPage = lazyWithRetry(() => import("@/pages/coming-soon"));
const RiwayatAktivitasPage = lazyWithRetry(() => import("@/pages/riwayat-aktivitas"));
const SesiAktifPage = lazyWithRetry(() => import("@/pages/sesi-aktif"));
const Setup2FAPage = lazyWithRetry(() => import("@/pages/setup-2fa"));
const PilihBahasaPage = lazyWithRetry(() => import("@/pages/pilih-bahasa"));
const PilihMataUangPage = lazyWithRetry(() => import("@/pages/pilih-mata-uang"));
const PrivacyPage = lazyWithRetry(() => import("@/pages/privacy"));
const UnduhDataPage = lazyWithRetry(() => import("@/pages/unduh-data"));
const LaporkanPage = lazyWithRetry(() => import("@/pages/laporkan"));
const NotFound = lazyWithRetry(() => import("@/pages/not-found"));
const MaintenancePage = lazyWithRetry(() => import("@/pages/maintenance"));
const CrewPage = lazyWithRetry(() => import("@/pages/crew"));
const MitraDashboardPage = lazyWithRetry(() => import("@/pages/mitra-dashboard"));
const MitraEditUsahaPage = lazyWithRetry(() => import("@/pages/mitra-edit-usaha"));

const IS_MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === "true";

const queryClient = new QueryClient();
void QueryClient;

function PageFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0194f3] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView({ behavior: "instant", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12, ease: "easeInOut" }}
        style={{ minHeight: "100dvh" }}
      >
    <Suspense fallback={null}>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      {/* Legacy explore links now use the same current Wisata flow. */}
      <Route path="/jelajahi" component={WisataPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/favorit" component={WishlistPage} />
      
      <Route path="/event" component={EventPage} />
      <Route path="/cultural-tour" component={NempoCulturalTourPage} />
      <Route path="/event/:slug/checkout" component={EventCheckout} />
      <Route path="/event/:slug" component={EventDetail} />
      
      <Route path="/kuliner" component={KulinerPage} />
      <Route path="/kuliner/:id" component={KulinerDetail} />
      <Route path="/warung" component={WarungPage} />
      <Route path="/cafe" component={CafePage} />
      <Route path="/cafe/:id" component={KulinerDetail} />
      <Route path="/jajan-yuk" component={JajanYukPage} />
      <Route path="/jajan-yuk/menu/:slug" component={JajanYukMenuPage} />
      <Route path="/jajan-yuk/lacak" component={JajanYukTrackPage} />
      <Route path="/jajan-yuk/:id" component={KulinerDetail} />
      
      <Route path="/wisata" component={WisataPage} />
      <Route path="/wisata/:id" component={WisataDetail} />
      
      <Route path="/penginapan" component={PenginapanPage} />
      <Route path="/penginapan/:id" component={PenginapanDetail} />
      
      
      <Route path="/tiket" component={TiketPage} />
      <Route path="/cek-tiket" component={CekTiketPage} />
      <Route path="/rent-car" component={RentCarPage} />
      <Route path="/adventure-gear" component={AdventureGearPage} />
      <Route path="/komunitas" component={KomunitasPage} />
      <Route path="/recruitment" component={RecruitmentPage} />
      <Route path="/portofolio" component={PortofolioPage} />
      <Route path="/contact" component={ContactPage} />
      
      
      <Route path="/kamus-sunda" component={KamusSundaPage} />
      
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profil" component={ProfilePage} />
      <Route path="/profil/ganti-password" component={ChangePasswordPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/profil/hapus-akun" component={DeleteAccountPage} />
      <Route path="/keranjang" component={KeranjangPage} />
      <Route path="/pesanan-saya" component={PesananSayaPage} />
      
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/thanks" component={ThanksPage} />
      
      <Route path="/voucherlist" component={VoucherListPage} />
      <Route path="/poin" component={PoinPage} />
      <Route path="/coupons" component={CouponsPage} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/pembayaran" component={PembayaranPage} />
      <Route path="/verify" component={VerifyPage} />
      
      <Route path="/digital-services/super-app" component={DigitalSuperAppDemoPage} />
      <Route path="/digital-services/ticketing" component={DigitalTicketingDemoPage} />
      <Route path="/digital-services/kasir" component={DigitalKasirDemoPage} />
      <Route path="/digital-services/antrian" component={DigitalQueueDemoPage} />
      <Route path="/digital-services/booking" component={DigitalBookingDemoPage} />
      <Route path="/digital-services/purchasing" component={DigitalPurchasingDemoPage} />
      <Route path="/digital-services/loyalty" component={DigitalLoyaltyDemoPage} />
      <Route path="/digital-services/gudang" component={DigitalWarehouseDemoPage} />
      <Route path="/digital-services/invitation" component={DigitalInvitationDemoPage} />
      <Route path="/digital-services/company" component={DigitalCompanyDemoPage} />
      <Route path="/digital-services/yearbook" component={DigitalYearbookDemoPage} />
      <Route path="/digital-services/marketing" component={DigitalMarketingDemoPage} />
      <Route path="/digital-services/qr-menu/customer/:tableId" component={DigitalQrMenuCustomerPage} />
      <Route path="/digital-services/qr-menu" component={DigitalQrMenuDemoPage} />
      <Route path="/digital-services/crm" component={DigitalCrmDemoPage} />
      <Route path="/digital-services/invoice" component={DigitalInvoiceDemoPage} />
      <Route path="/digital-services/dapur-stock" component={DigitalDapurStockDemoPage} />
      <Route path="/digital-services/hpp" component={DigitalHppDemoPage} />
      <Route path="/digital-services/resep" component={DigitalRecipeDemoPage} />
      <Route path="/digital-services/human-resource" component={DigitalHumanResourceDemoPage} />
      <Route path="/digital-services/link-bio" component={DigitalLinkBioDemoPage} />
      <Route path="/digital-services" component={DigitalServicesPage} />
      <Route path="/influencer-hub" component={InfluencerHubPage} />
      <Route path="/sponsorship/halloween/proposal" component={HalloweenProposalPage} />
      <Route path="/sponsorship/halloween" component={SponsorshipEventPage} />
      <Route path="/sponsorship" component={SponsorshipPage} />
      <Route path="/event-organizer" component={EventOrganizerPage} />
      <Route path="/wedding-organizer" component={WeddingOrganizerPage} />
      <Route path="/wedding-invitation/tema/:slug" component={InvitationDemoPage} />
      <Route path="/wedding-invitation" component={WeddingInvitationPage} />
      <Route path="/business-system" component={BusinessSystemPage} />
      <Route path="/design-creative" component={DesignCreativePage} />
      <Route path="/web-development" component={WebDevelopmentPage} />
      <Route path="/sosmed-management" component={SosmedManagementPage} />
      <Route path="/kerja-sama" component={PriceListPage} />
      <Route path="/price-list" component={PriceListPage} />
      {/* <Route path="/donasi-bibit" component={DonasiBibitPage} /> */}
      <Route path="/talent" component={TalentPage} />
      <Route path="/merchandise" component={MerchandisePage} />
      <Route path="/cari" component={CariPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/itinerary" component={ItineraryComingSoonPage} />
      
      <Route path="/edit-profil" component={EditProfilPage} />
      <Route path="/ulasan" component={UlasanPage} />
      <Route path="/notifikasi" component={NotifikasiPage} />
      <Route path="/referral" component={ReferralPage} />
      <Route path="/bantuan" component={BantuanPage} />
      <Route path="/tos" component={TosPage} />
      <Route path="/crew" component={CrewPage} />
      <Route path="/mitra-dashboard" component={MitraDashboardPage} />
      <Route path="/mitra-usaha/edit" component={MitraEditUsahaPage} />

      <Route path="/edit-email" component={ComingSoonPage} />
      <Route path="/edit-phone" component={ComingSoonPage} />
      <Route path="/verifikasi-identitas" component={ComingSoonPage} />
      <Route path="/sesi-aktif" component={SesiAktifPage} />
      <Route path="/riwayat-aktivitas" component={RiwayatAktivitasPage} />
      <Route path="/setup-2fa" component={Setup2FAPage} />
      <Route path="/pilih-bahasa" component={PilihBahasaPage} />
      <Route path="/pilih-mata-uang" component={PilihMataUangPage} />
      <Route path="/unduh-data" component={UnduhDataPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/laporkan" component={LaporkanPage} />
      
      <Route component={NotFound} />
    </Switch>
    </Suspense>
    </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const initPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isHomePath = initPath === "/" || initPath === "";
  const forceSplash =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("splash") === "1";
  const [showSplash, setShowSplash] = useState(
    isHomePath && (import.meta.env.PROD || forceSplash),
  );

  useEffect(() => {
    if (!showSplash) return;

    // Do not let a throttled animation frame leave the app behind the splash.
    const fallback = window.setTimeout(() => setShowSplash(false), 4000);
    return () => window.clearTimeout(fallback);
  }, [showSplash]);

  if (IS_MAINTENANCE) {
    return (
      <Suspense fallback={<PageFallback />}>
        <MaintenancePage />
      </Suspense>
    );
  }

  return (
    <ErrorBoundary>
    <MatchProvider>
    <PancoProvider>
    <DarkModeProvider>
    <AuthProvider>
    <GoogleAuthProvider>
     <CityFilterProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NetworkStatus />
          <WouterRouter>
            <Router />
          </WouterRouter>
          <Toaster />
          <JingleMiniPlayer />
        </TooltipProvider>
        {showSplash && (
          <Suspense fallback={null}>
            <Splash onDone={() => setShowSplash(false)} />
          </Suspense>
        )}
      </QueryClientProvider>
     </CityFilterProvider>
    </GoogleAuthProvider>
    </AuthProvider>
    </DarkModeProvider>
    </PancoProvider>
    </MatchProvider>
    </ErrorBoundary>
  );
}

export default App;
