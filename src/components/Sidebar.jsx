import { Link, useLocation } from 'react-router-dom'

const userAvatar = "https://i.pravatar.cc/84"

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: 'folder' },
    { path: '/dashboard', icon: 'dashboard' },
    { path: '/tune', icon: 'tune' },
    { path: '/lock', icon: 'lock' },
    { path: '/contacts', icon: 'contacts' },
    { path: '/language', icon: 'language' },
  ]

  return (
    <div className="bg-[#1f2937] flex flex-col gap-6 items-center pb-4 pt-12 px-6 min-h-screen w-[90px] relative">
      {/* Logo */}
      <div className="pb-12 pl-2 w-full">
        <div className="w-7 h-7">
          <img src="/findem-logo.svg" alt="Findem Logo" className="w-full h-full" />
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex gap-[18px] items-start w-full"
            >
              <div className={`flex gap-3 items-center px-3 py-2.5 rounded transition-all ${
                isActive ? 'bg-[#31374e]' : 'hover:bg-[#31374e]/50'
              }`}>
                <span className="material-icons-round text-white text-[18px] leading-[18px]" style={{ fontSize: '18px' }}>
                  {item.icon}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* User Menu at Bottom */}
      <div className="w-full">
        <div className="flex gap-3 items-center justify-center p-3 rounded">
          <div className="w-[42px] h-[42px] rounded-full overflow-hidden flex-shrink-0">
            <img
              src={userAvatar}
              alt="User avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Shadow overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" />
    </div>
  )
}

export default Sidebar
