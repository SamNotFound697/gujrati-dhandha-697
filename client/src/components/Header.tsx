import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, User, Palette, Coffee, UserCheck, Store, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getStoredInterface, setStoredInterface } from "@/lib/auth";
import { AuthModal } from "./AuthModal";
import { AdBanner } from "./AdBanner";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onShowDonation?: () => void;
}

export function Header({ onSearch, onShowDonation }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentInterface, setCurrentInterface] = useState<'buyer' | 'seller'>(() => 
    getStoredInterface()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const toggleInterface = () => {
    const newInterface = currentInterface === 'buyer' ? 'seller' : 'buyer';
    setCurrentInterface(newInterface);
    setStoredInterface(newInterface);
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 theme-transition border-b" style={{ 
        backgroundColor: 'var(--bg-primary)', 
        borderColor: 'var(--bg-secondary)' 
      }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                <Store className="h-6 w-6" />
                <span>Gujrati Dhandha</span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  id="searchInput"
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-12 border-2 rounded-full focus:outline-none focus:ring-2 theme-transition"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    color: 'var(--text-primary)',
                    borderColor: 'var(--bg-secondary)'
                  }}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto hover:bg-transparent"
                  style={{ color: 'var(--accent)' }}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Right Menu */}
            <div className="flex items-center space-x-6">
              {/* Amazon Partner Badge */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900 rounded-full">
                <span className="text-xs font-medium text-orange-800 dark:text-orange-200">
                  🤝 Amazon Partner
                </span>
              </div>

              {/* Vibe Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 theme-transition">
                    <Palette className="h-4 w-4" />
                    <span className="hidden md:inline">Vibe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <span style={{ color: 'var(--text-primary)' }}>☀️ Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <span style={{ color: 'var(--text-primary)' }}>🌙 Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('cool')}>
                    <span style={{ color: 'var(--text-primary)' }}>✨ Cool</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Interface Toggle */}
              {isAuthenticated && (
                <Button
                  onClick={toggleInterface}
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-2 theme-transition"
                >
                  {currentInterface === 'buyer' ? <UserCheck className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                  <span>{currentInterface === 'buyer' ? 'Seller Mode' : 'Buyer Mode'}</span>
                </Button>
              )}

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative theme-transition">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 theme-transition">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">{user?.fullName || user?.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        <span style={{ color: 'var(--text-primary)' }}>👤 Account</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <span style={{ color: 'var(--text-primary)' }}>📦 Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    {currentInterface === 'seller' && (
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard">
                          <span style={{ color: 'var(--text-primary)' }}>🏪 Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <span style={{ color: 'var(--text-primary)' }}>
                          <DollarSign className="h-4 w-4 mr-2 inline" />
                          Revenue Dashboard
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <span style={{ color: 'var(--text-primary)' }}>🚪 Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 theme-transition">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <DropdownMenuItem onClick={() => openAuthModal('signup')}>
                      <span style={{ color: 'var(--text-primary)' }}>📝 Sign Up</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAuthModal('login')}>
                      <span style={{ color: 'var(--text-primary)' }}>🔐 Sign In</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Navigation Menu with Dividers */}
          <nav className="border-t py-2 relative" style={{ borderColor: 'var(--bg-secondary)' }}>
            {/* Moving RGB line for cool theme */}
            <div className="moving-rgb-line"></div>
            
            <div className="flex items-center space-x-8">
              <Link href="/categories" className="text-sm hover:text-accent theme-transition">
                All Categories
              </Link>
              <div className="category-divider"></div>
              <Link href="/electronics" className="text-sm hover:text-accent theme-transition">
                Electronics
              </Link>
              <div className="category-divider"></div>
              <Link href="/fashion" className="text-sm hover:text-accent theme-transition">
                Fashion
              </Link>
              <div className="category-divider"></div>
              <Link href="/home" className="text-sm hover:text-accent theme-transition">
                Home & Garden
              </Link>
              <div className="category-divider"></div>
              <Link href="/sports" className="text-sm hover:text-accent theme-transition">
                Sports
              </Link>
              <div className="category-divider"></div>
              <Link href="/books" className="text-sm hover:text-accent theme-transition">
                Books
              </Link>
              <div className="category-divider"></div>
              <Link href="/about" className="text-sm hover:text-accent theme-transition">
                About Me
              </Link>
              <div className="category-divider"></div>
              <Link href="/contact" className="text-sm hover:text-accent theme-transition">
                Contact
              </Link>
              <div className="category-divider"></div>
              <Button
                onClick={onShowDonation}
                variant="ghost"
                size="sm"
                className="text-sm hover:text-accent theme-transition p-0 h-auto"
              >
                <Coffee className="h-4 w-4 mr-1" />
                Buy Me Coffee
              </Button>
            </div>
          </nav>
        </div>

        {/* Ad Banner */}
        <div className="border-t" style={{ borderColor: 'var(--bg-secondary)' }}>
          <div className="container mx-auto px-4 py-2 flex justify-center">
            <AdBanner placement="header" />
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
    </>
  );
}