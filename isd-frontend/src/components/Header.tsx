import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Home, Menu, X, User, LogOut } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ firstName: string } | null>(null)
  const navigate = useNavigate()

  const syncUser = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.firstName) {
          setUser({ firstName: payload.firstName });
          return;
        }
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
    setUser(null);
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener('auth-change', syncUser);
    return () => window.removeEventListener('auth-change', syncUser);
  }, [syncUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate({ to: '/' });
  };


  return (
    <>
      <header className="relative z-30 px-4 py-4 flex items-center bg-(--ivory-sand) text-(--burnt-sienna) shadow-md">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-bold">
          <Link to="/">
            TRAVELTHAI
          </Link>
        </h1>
        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <div className="relative group flex items-center">
                <div className="p-2 bg-(--ivory-sand) border border-(--burnt-sienna) rounded-full text-(--burnt-sienna) cursor-pointer">
                  <User size={20} />
                </div>
                {/* Hover text */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Hello {user.firstName}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="relative flex items-center gap-1 text-sm font-medium hover:text-(--burnt-sienna)/60 transition-colors group"
                title="Log out"
              >
                <LogOut size={20} />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 
                                text-xs bg-gray-800 text-white px-2 py-0.5 rounded 
                                opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Log out
                </span>
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-(--burnt-sienna)/60 transition-colors">
              Register/Login
            </Link>
          )}
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white text-(--burnt-sienna) shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-(--ivory-sand) bg-(--ivory-sand) text-(--burnt-sienna)">
          <h2 className="text-xl font-bold">TRAVELTHAI</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-(--ivory-sand) transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-[var(--ivory-sand)] text-[var(--burnt-sienna)] font-bold transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Add more links here if needed */}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
