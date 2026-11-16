/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollReveal';
import { AppProvider } from './context/AppContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthPage } from './pages/AuthPage';
import { BookingsPage } from './pages/BookingsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DiningPage } from './pages/DiningPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { ProfilePage } from './pages/ProfilePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { RealEstatePage } from './pages/RealEstatePage';
import { RentalsPage } from './pages/RentalsPage';
import { StayDetailPage } from './pages/StayDetailPage';
import { StaysPage } from './pages/StaysPage';
import { TripPlannerPage } from './pages/TripPlannerPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ScrollProgressBar />
          <div className="min-h-screen flex flex-col bg-[#F4F0E6] text-[#292B27]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                <Route path="/stays" element={<StaysPage />} />
                <Route path="/stays/:slug" element={<StayDetailPage />} />
                <Route path="/experiences" element={<ExperiencesPage />} />
                <Route path="/dining" element={<DiningPage />} />
                <Route path="/rentals" element={<RentalsPage />} />
                <Route path="/real-estate" element={<RealEstatePage />} />
                <Route path="/real-estate/:slug" element={<PropertyDetailPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/journal/:slug" element={<ArticleDetailPage />} />
                <Route path="/plan-trip" element={<TripPlannerPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </MotionConfig>
  );
}
