import { Link, useLocation } from "react-router";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/react";
import {
  PlusIcon,
  UserIcon,
  SettingsIcon,
  XIcon,
  SmartphoneIcon,
  InfoIcon,
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/about", label: "About Us", icon: InfoIcon },
  { to: "/download", label: "Android App", icon: SmartphoneIcon },
];

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settingsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSettingsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-base-300/90 backdrop-blur-md shadow-lg" : "bg-base-300"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                <span className="text-primary-content font-black text-xs tracking-tighter">
                  LC
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-sm bg-secondary group-hover:scale-125 transition-transform duration-200" />
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">
              LC<span className="text-primary">STORE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-base-content/10 ${
                  location.pathname === to
                    ? "bg-primary/15 text-primary"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isSignedIn && (
              <>
                <Link
                  to="/create"
                  className="hidden sm:flex btn btn-primary btn-sm gap-1.5 rounded-lg"
                >
                  <PlusIcon className="size-3.5" />
                  <span>New Product</span>
                </Link>
                <Link
                  to="/profile"
                  className="hidden sm:flex btn btn-ghost btn-sm gap-1.5 rounded-lg"
                >
                  <UserIcon className="size-3.5" />
                  <span>Profile</span>
                </Link>
              </>
            )}

            {!isSignedIn && (
              <div className="hidden sm:flex items-center gap-1.5">
                <SignInButton mode="modal">
                  <button className="btn btn-ghost btn-sm rounded-lg">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn btn-primary btn-sm rounded-lg">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}

            {isSignedIn && <UserButton />}

            {/* Settings Button */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => {
                  setSettingsOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                className={`btn btn-ghost btn-sm btn-square rounded-lg transition-all duration-200 ${
                  settingsOpen ? "bg-base-content/10 rotate-45" : ""
                }`}
                aria-label="Settings"
              >
                <SettingsIcon className="size-4" />
              </button>

              {/* Settings Panel */}
              <div
                className={`absolute right-0 top-full mt-2 w-80 rounded-2xl bg-base-200 shadow-2xl border border-base-content/10 overflow-hidden transition-all duration-300 origin-top-right ${
                  settingsOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
                style={{ transformOrigin: "top right" }}
              >
                <div className="p-4 border-b border-base-content/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Settings</p>
                    <p className="text-xs text-base-content/50">
                      Customize your experience
                    </p>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="btn btn-ghost btn-xs btn-square rounded-lg"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Theme Section */}
                  <ThemeSelector />

                  {/* Divider */}
                  <div className="divider my-1 text-xs text-base-content/30">
                    Quick Links
                  </div>

                  {/* Quick links inside settings */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/download"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-300 hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    >
                      <SmartphoneIcon className="size-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs font-medium">Android App</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-300 hover:bg-secondary/10 hover:text-secondary transition-all duration-200 group"
                    >
                      <InfoIcon className="size-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs font-medium">About Us</span>
                    </Link>
                  </div>

                  {/* Auth in settings for mobile */}
                  {!isSignedIn && (
                    <div className="sm:hidden space-y-2 pt-1">
                      <SignInButton mode="modal">
                        <button className="btn btn-outline btn-sm w-full rounded-xl">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="btn btn-primary btn-sm w-full rounded-xl">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  )}

                  {isSignedIn && (
                    <div className="sm:hidden space-y-2 pt-1">
                      <Link
                        to="/create"
                        className="btn btn-primary btn-sm w-full rounded-xl gap-1.5"
                      >
                        <PlusIcon className="size-3.5" /> New Product
                      </Link>
                      <Link
                        to="/profile"
                        className="btn btn-ghost btn-sm w-full rounded-xl gap-1.5"
                      >
                        <UserIcon className="size-3.5" /> Profile
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen((v) => !v);
                setSettingsOpen(false);
              }}
              className={`md:hidden btn btn-ghost btn-sm btn-square rounded-lg transition-all duration-200 ${
                mobileMenuOpen ? "bg-base-content/10" : ""
              }`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="size-4" />
              ) : (
                <MenuIcon className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Links Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 bg-base-300/95 backdrop-blur-md border-t border-base-content/10 space-y-1 pt-2">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? "bg-primary/15 text-primary"
                    : "text-base-content/70 hover:bg-base-content/10 hover:text-base-content"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
