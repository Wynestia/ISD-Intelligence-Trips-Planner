import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Home, Menu, X, User, LogOut, MessageSquare } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isHomePage = pathname === '/'
  const isChatPage = pathname === '/about'
  const isPoptripPage = pathname.startsWith('/poptrip')
  const isLifestylePage = pathname.startsWith('/lifestyle')

  // Poptrip + Lifestyle: header should sit directly on top of the image
  const isOverlayNav = isPoptripPage || isLifestylePage

  // Home + Poptrip + Lifestyle use glass / transparent navigation + sidebar
  const isGlassLayout = isHomePage || isPoptripPage || isLifestylePage

  // Pages where nav content should be light-on-image (white text, glassy buttons)
  const isLightNav = isHomePage || isOverlayNav
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
      <header
        className={`relative z-30 px-4 py-3 bg-transparent flex items-center transition-all
        ${isGlassLayout
            ? 'absolute top-0 left-0 right-0 backdrop-blur-md text-white shadow-none border-b border-white/10'
            : isOverlayNav
              ? 'absolute top-0 left-0 right-0 bg-transparent text-white shadow-none border-b-0'
              : 'bg-(--ivory-sand) text-(--burnt-sienna) shadow-sm border-b border-(--ivory-sand)'
          }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={`p-2 rounded-lg transition-all border border-transparent 
            ${isLightNav
              ? 'hover:bg-white/15 hover:border-white/40'
              : 'hover:bg-(--ivory-sand)/60 hover:border-(--burnt-sienna)/30'}`}
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
                <div
                  className={`p-2 border rounded-full cursor-pointer
                  ${isLightNav
                      ? 'text-white border-white/60 bg-white/10 backdrop-blur-md hover:border-white hover:bg-white/20 transition-all'
                      : 'bg-(--ivory-sand) border-(--burnt-sienna) text-(--burnt-sienna)'}`}
                >
                  <User size={20} />
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Hello {user.firstName}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`relative flex items-center gap-1 text-sm font-medium transition-colors group
                  ${isLightNav ? 'text-white hover:text-white/70' : 'hover:text-(--burnt-sienna)/60'}`}
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
            <Link
              to="/login"
              className={`text-sm font-bold font-medium px-3 py-1.5 rounded-full border border-transparent transition-all
                ${isLightNav
                  ? 'text-white hover:bg-gray-500/15 border-white/40 backdrop-blur-md'
                  : 'text-(--burnt-sienna) hover:bg-white/70 hover:border-(--burnt-sienna)/40'}`}
            >
              Register/Login
            </Link>
          )}
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isGlassLayout ? 'bg-white/10 text-white backdrop-blur-xl border-r border-white/20' : 'bg-white text-(--burnt-sienna)'}`}
      >
        <div
          className={`flex items-center justify-between p-4 border-b
            ${isGlassLayout
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-(--ivory-sand) border-(--ivory-sand) text-(--burnt-sienna)'}`}
        >
          <h2 className="text-xl font-bold">TRAVELTHAI</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-all border border-transparent 
              ${isGlassLayout
                ? 'hover:bg-white/20 hover:border-white/50'
                : 'hover:bg-(--ivory-sand)/60 hover:border-(--burnt-sienna)/30'}`}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 border border-transparent transition-all
              ${isGlassLayout
                ? 'hover:bg-white/15 hover:border-white/40'
                : 'hover:bg-(--ivory-sand)'}`}
            activeProps={{
              className:
                isGlassLayout
                  ? 'flex items-center gap-3 p-3 rounded-lg bg-white/20 border border-white/60 text-white font-bold transition-all mb-2'
                  : 'flex items-center gap-3 p-3 rounded-lg bg-[var(--ivory-sand)] text-[var(--burnt-sienna)] font-bold transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Chat link — hidden on the chat page itself */}
          {!isChatPage && (
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 border border-transparent transition-all
                ${isGlassLayout
                  ? 'hover:bg-white/15 hover:border-white/40'
                  : 'hover:bg-(--ivory-sand)'}`}
              activeProps={{
                className:
                  isGlassLayout
                    ? 'flex items-center gap-3 p-3 rounded-lg bg-white/20 border border-white/60 text-white font-bold transition-all mb-2'
                    : 'flex items-center gap-3 p-3 rounded-lg bg-[var(--ivory-sand)] text-[var(--burnt-sienna)] font-bold transition-colors mb-2',
              }}
            >
              <MessageSquare size={20} />
              <span className="font-medium">Chat</span>
            </Link>
          )}
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
