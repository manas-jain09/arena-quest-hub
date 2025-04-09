
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookText, Trophy, Tool, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
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
                <Tool size={16} />
                <span>ArenaTools</span>
              </a>
              <Button onClick={onLogout} variant="ghost" className="arena-nav-link flex items-center gap-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button */}
            <Button variant="ghost" className="p-1">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
