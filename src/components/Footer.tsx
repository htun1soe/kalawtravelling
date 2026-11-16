import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="bg-[#243D32] text-[#F4F0E6] border-t border-[#52634A]/40">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#F4F0E6]/15">
          {/* About Kalaw Travel */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="font-serif text-3xl font-semibold tracking-tight text-[#F4F0E6] inline-block">
              Kalaw Travel
            </Link>
            <p className="text-sm text-[#D9CCB8] leading-relaxed max-w-sm">
              {t.footer.about}
            </p>
            <p className="text-xs text-[#D9CCB8]/80 tabular-nums">
              1,320 m Elevation · 20.6311° N, 96.5612° E
            </p>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#D9CCB8]/70">{t.footer.explore}</h3>
            <ul className="space-y-2.5 text-sm text-[#F4F0E6]/90">
              <li><Link to="/destinations" className="hover:text-[#D9CCB8] transition-colors">{t.nav.destinations}</Link></li>
              <li><Link to="/stays" className="hover:text-[#D9CCB8] transition-colors">{t.nav.stays}</Link></li>
              <li><Link to="/journal" className="hover:text-[#D9CCB8] transition-colors">{t.nav.journal}</Link></li>
              <li><Link to="/plan-trip" className="hover:text-[#D9CCB8] transition-colors">{t.nav.planTrip}</Link></li>
            </ul>
          </div>

          {/* Travel Services */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#D9CCB8]/70">{t.footer.services}</h3>
            <ul className="space-y-2.5 text-sm text-[#F4F0E6]/90">
              <li><Link to="/experiences" className="hover:text-[#D9CCB8] transition-colors">{t.nav.experiences}</Link></li>
              <li><Link to="/dining" className="hover:text-[#D9CCB8] transition-colors">{t.nav.dining}</Link></li>
              <li><Link to="/rentals" className="hover:text-[#D9CCB8] transition-colors">{t.nav.rentals}</Link></li>
              <li><Link to="/bookings" className="hover:text-[#D9CCB8] transition-colors">{t.nav.bookings}</Link></li>
            </ul>
          </div>

          {/* Real Estate */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#D9CCB8]/70">{t.footer.realEstate}</h3>
            <ul className="space-y-2.5 text-sm text-[#F4F0E6]/90">
              <li><Link to="/real-estate?cat=Houses+for+Sale" className="hover:text-[#D9CCB8] transition-colors">{t.categories['Houses for Sale']}</Link></li>
              <li><Link to="/real-estate?cat=Houses+for+Rent" className="hover:text-[#D9CCB8] transition-colors">{t.categories['Houses for Rent']}</Link></li>
              <li><Link to="/real-estate?cat=Land+for+Sale" className="hover:text-[#D9CCB8] transition-colors">{t.categories['Land for Sale']}</Link></li>
              <li><Link to="/real-estate?submit=1" className="hover:text-[#D9CCB8] transition-colors">{t.home.listProperty}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#D9CCB8]/70">{t.footer.contact}</h3>
            <ul className="space-y-2.5 text-sm text-[#F4F0E6]/90">
              <li>Station Road, Quarter 4</li>
              <li>Kalaw, Shan State</li>
              <li>concierge@kalawtravel.com</li>
              <li className="pt-1 flex items-center gap-4 text-xs text-[#D9CCB8]">
                <a href="#instagram" onClick={(e) => e.preventDefault()} className="hover:text-[#F4F0E6] underline-offset-4 hover:underline">Instagram</a>
                <a href="#journal" onClick={(e) => e.preventDefault()} className="hover:text-[#F4F0E6] underline-offset-4 hover:underline">Dispatch</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#D9CCB8]/75">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/explore" className="hover:text-[#F4F0E6] transition-colors">{t.footer.terms}</Link>
            <Link to="/explore" className="hover:text-[#F4F0E6] transition-colors">{t.footer.privacy}</Link>
            <Link to="/admin" className="hover:text-[#F4F0E6] transition-colors">{t.footer.admin}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
