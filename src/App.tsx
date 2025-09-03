import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const scrollToSection = (sectionId: string) => {
    // If we're on the projects page, navigate to home first
    if (location.pathname === '/projects') {
      navigate('/', { state: { scrollTo: sectionId } })
    } else {
      // If we're already on home, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Hide header on projects page */}
      {location.pathname !== '/projects' && (
        <header className="sticky top-0 z-20 backdrop-saturate-150 backdrop-blur-md bg-black/60 border-b border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/favicon.png" alt="KO" className="h-12 w-12" />
            </Link>
            <nav className="hidden sm:flex gap-4 text-sm">
              <button 
                onClick={() => scrollToSection('experience')} 
                className="text-neutral-200 hover:text-accent transition-colors"
              >
                Experience
              </button>
              <button 
                onClick={() => scrollToSection('education')} 
                className="text-neutral-200 hover:text-accent transition-colors"
              >
                Education
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-neutral-200 hover:text-accent transition-colors"
              >
                Contact
              </button>
              <NavLink to="/projects" className="text-neutral-200 hover:text-accent transition-colors">Projects</NavLink>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1"><Outlet /></main>
      {/* Hide footer on projects page too for cleaner look */}
      {location.pathname !== '/projects' && (
        <footer className="border-t border-neutral-800 text-neutral-400 text-center py-6">© 2025 Kite Ogawa</footer>
      )}
    </div>
  )
}


