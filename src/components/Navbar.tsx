import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, lang, toggleLang, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    setSearchOpen(false);
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  const transparentMode = isHome && !scrolled && !mobileOpen && !searchOpen;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm whitespace-nowrap shrink-0 transition-colors duration-150 pb-0.5 border-b ${
      isActive
        ? transparentMode
          ? 'text-[#F4F0E6] border-[#F4F0E6]'
          : 'text-[#243D32] border-[#B66F52] font-medium'
        : transparentMode
          ? 'text-[#F4F0E6]/85 border-transparent hover:text-[#F4F0E6] hover:border-[#F4F0E6]/50'
          : 'text-[#292B27]/80 border-transparent hover:text-[#243D32] hover:border-[#243D32]/40'
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        transparentMode
          ? 'bg-gradient-to-b from-[#292B27]/65 to-transparent text-[#F4F0E6]'
          : 'bg-[#F4F0E6]/95 backdrop-blur-sm border-b border-[#D9CCB8] text-[#292B27]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4 xl:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className={`font-serif text-2xl font-semibold tracking-tight whitespace-nowrap shrink-0 ${
            transparentMode ? 'text-[#F4F0E6]' : 'text-[#243D32]'
          }`}
        >
          Kalaw Travel
        </Link>

        {/* Zone 2: Concise single-line desktop links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6" aria-label="Primary navigation">
          <NavLink to="/explore" className={navLinkClass}>
            {t.nav.explore}
          </NavLink>
          <NavLink to="/destinations" className={navLinkClass}>
            {t.nav.destinations}
          </NavLink>
          <NavLink to="/stays" className={navLinkClass}>
            {t.nav.stays}
          </NavLink>
          <NavLink to="/experiences" className={navLinkClass}>
            {t.nav.experiences}
          </NavLink>
          <NavLink to="/dining" className={navLinkClass}>
            {t.nav.dining}
          </NavLink>
          <NavLink to="/rentals" className={navLinkClass}>
            {t.nav.rentals}
          </NavLink>
          <NavLink to="/real-estate" className={navLinkClass}>
            {t.nav.realEstate}
          </NavLink>
        </nav>

        {/* Zone 3: Language Switch, Search & Auth / Profile Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            aria-label="Switch language between English and Burmese"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs border rounded-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              transparentMode
                ? 'border-[#F4F0E6]/40 text-[#F4F0E6] hover:bg-[#F4F0E6]/10'
                : 'border-[#D9CCB8] text-[#243D32] hover:border-[#243D32]'
            }`}
          >
            <span className={lang === 'en' ? 'font-semibold underline underline-offset-4' : 'opacity-65'}>
              EN
            </span>
            <span className="opacity-40">/</span>
            <span className={lang === 'my' ? 'font-semibold underline underline-offset-4' : 'opacity-65'}>
              မြန်မာ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={t.nav.searchBtn}
            className={`p-2 rounded-sm transition-colors cursor-pointer ${
              transparentMode
                ? 'text-[#F4F0E6] hover:bg-[#F4F0E6]/10'
                : 'text-[#243D32] hover:bg-[#D9CCB8]/40'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            to={user ? '/profile' : '/auth'}
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-colors rounded-sm ${
              transparentMode
                ? 'bg-[#F4F0E6] text-[#243D32] hover:bg-[#D9CCB8]'
                : 'bg-[#243D32] text-[#F4F0E6] hover:bg-[#52634A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{user ? user.name.split(' ')[0] : t.nav.signIn}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className={`lg:hidden p-2 rounded-sm cursor-pointer ${
              transparentMode ? 'text-[#F4F0E6]' : 'text-[#243D32]'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quick Search Bar Drawer */}
      {searchOpen && (
        <div className="bg-[#F4F0E6] border-t border-b border-[#D9CCB8] text-[#292B27]">
          <form
            onSubmit={handleQuickSearch}
            className="max-w-[1360px] mx-auto px-6 md:px-10 py-4 flex items-center gap-4"
          >
            <Search className="w-4 h-4 text-[#52634A] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-transparent text-sm text-[#292B27] placeholder-[#52634A]/70 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.searchBtn}
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F4F0E6] border-t border-[#D9CCB8] text-[#292B27] px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link to="/explore" className="py-2 border-b border-[#D9CCB8]">{t.nav.explore}</Link>
            <Link to="/destinations" className="py-2 border-b border-[#D9CCB8]">{t.nav.destinations}</Link>
            <Link to="/stays" className="py-2 border-b border-[#D9CCB8]">{t.nav.stays}</Link>
            <Link to="/experiences" className="py-2 border-b border-[#D9CCB8]">{t.nav.experiences}</Link>
            <Link to="/dining" className="py-2 border-b border-[#D9CCB8]">{t.nav.dining}</Link>
            <Link to="/rentals" className="py-2 border-b border-[#D9CCB8]">{t.nav.rentals}</Link>
            <Link to="/real-estate" className="py-2 border-b border-[#D9CCB8]">{t.nav.realEstate}</Link>
            <Link to="/journal" className="py-2 border-b border-[#D9CCB8]">{t.nav.journal}</Link>
            <Link to="/plan-trip" className="py-2 border-b border-[#D9CCB8]">{t.nav.planTrip}</Link>
            <Link to="/bookings" className="py-2 border-b border-[#D9CCB8]">{t.nav.bookings}</Link>
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Link
              to={user ? '/profile' : '/auth'}
              className="flex-1 text-center py-2.5 bg-[#243D32] text-[#F4F0E6] text-sm font-medium rounded-sm"
            >
              {user ? user.name.split(' ')[0] : t.nav.signIn}
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2.5 border border-[#243D32] text-[#243D32] text-sm font-medium rounded-sm"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
