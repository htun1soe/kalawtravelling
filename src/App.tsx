/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MotionConfig } from 'motion/react';
import { Footer } from './components/Footer';
import { GalleryLightboxModal } from './components/GalleryLightboxModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollReveal';
import { AppProvider, useApp } from './context/AppContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { BookingsPage } from './pages/BookingsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DiningPage } from './pages/DiningPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { ProfilePage } from './pages/ProfilePage';
import { RealEstatePage } from './pages/RealEstatePage';
import { RentalsPage } from './pages/RentalsPage';
import { StaysPage } from './pages/StaysPage';
import { TripPlannerPage } from './pages/TripPlannerPage';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const AppShell: React.FC = () => {
  const { mapsApiKey, quotaExceeded, lang, t } = useApp();

  const shellContent = (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollProgressBar />
      {quotaExceeded && (
        <div
          role="alert"
          className="sticky top-0 z-[80] bg-[#FAF7F0] border-b border-[#A4834C] text-[#222420] px-4 py-2.5 text-xs flex flex-wrap items-center justify-center gap-3 shadow-sm"
        >
          <span>{t.navigationMap.quotaBannerTitle}</span>
          <a
            href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1B3128] underline underline-offset-4 hover:text-[#A4834C]"
          >
            {t.navigationMap.quotaBannerLinkText}
          </a>
        </div>
      )}
      <div className="min-h-screen flex flex-col bg-[#F6F2E9] text-[#222420]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/stays" element={<StaysPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/dining" element={<DiningPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/real-estate" element={<RealEstatePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/plan-trip" element={<TripPlannerPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <ItemDetailModal />
        <GalleryLightboxModal />
      </div>
    </BrowserRouter>
  );

  if (!mapsApiKey) {
    return shellContent;
  }

  return (
    <APIProvider
      apiKey={mapsApiKey}
      libraries={['marker', 'routes']}
      language={lang === 'my' ? 'my' : 'en'}
      region="MM"
    >
      {shellContent}
    </APIProvider>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <AppShell />
      </AppProvider>
    </MotionConfig>
  );
}
