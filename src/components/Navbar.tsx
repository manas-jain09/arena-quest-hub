
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookText, Trophy, Wrench, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-arena-gray shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-arena-red">ArenaHQ</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="arena-nav-link active flex items-center gap-1">
                <Home size={16} />
                <span>Home</span>
              </Link>
              <a href="https://quiz.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1">
                <BookText size={16} />
                <span>ArenaQuiz</span>
              </a>
              <a href="https://contest.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1">
                <Trophy size={16} />
                <span>ArenaContest</span>
              </a>
              <a href="https://tools.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1">
                <Wrench size={16} />
                <span>ArenaTools</span>
              </a>
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
              <a href="https://quiz.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1 py-3" onClick={() => setMobileMenuOpen(false)}>
                <BookText size={16} />
                <span>ArenaQuiz</span>
              </a>
              <a href="https://contest.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1 py-3" onClick={() => setMobileMenuOpen(false)}>
                <Trophy size={16} />
                <span>ArenaContest</span>
              </a>
              <a href="https://tools.arenahq-mitwpu.in" target="_blank" rel="noopener noreferrer" className="arena-nav-link flex items-center gap-1 py-3" onClick={() => setMobileMenuOpen(false)}>
                <Wrench size={16} />
                <span>ArenaTools</span>
              </a>
              <Button onClick={() => { onLogout(); setMobileMenuOpen(false); }} variant="ghost" className="arena-nav-link flex items-center gap-1 py-3 justify-start">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
