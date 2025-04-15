
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useState } from 'react';
import { UserSettingsDialog } from './UserSettingsDialog';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-arena-gray shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-arena-red">AstraCode</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="arena-nav-link active flex items-center gap-1">
                <Home size={16} />
                <span>Home</span>
              </Link>
              <a href={`https://yodha.arenahq-mitwpu.in/profile/${localStorage.getItem('userId') || ''}`} target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1">
                <User size={16} />
                <span>Yodha</span>
              </a>
              <Button onClick={() => setSettingsOpen(true)} variant="ghost" className="arena-nav-link flex items-center gap-1">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
              <Button onClick={onLogout} variant="ghost" className="arena-nav-link flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" className="p-1" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-arena-gray">
            <div className="flex flex-col py-2">
              <Link to="/" className="arena-nav-link active flex items-center gap-1 py-3" onClick={() => setMobileMenuOpen(false)}>
                <Home size={16} />
                <span>Home</span>
              </Link>
              <a href={`https://yodha.arenahq-mitwpu.in/profile/${localStorage.getItem('userId') || ''}`} target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1 py-3" onClick={() => setMobileMenuOpen(false)}>
                <User size={16} />
                <span>Yodha</span>
              </a>
              <Button onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }} variant="ghost" className="arena-nav-link flex items-center gap-1 py-3 justify-start">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
              <Button onClick={() => { onLogout(); setMobileMenuOpen(false); }} variant="ghost" className="arena-nav-link flex items-center gap-1 py-3 justify-start">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Dialog */}
      <UserSettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
        userId={localStorage.getItem('userId') || ''}
      />
    </nav>
  );
};
