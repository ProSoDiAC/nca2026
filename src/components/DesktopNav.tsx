import { Link, NavLink } from 'react-router-dom';
import { strings } from '../strings';
import { Container } from './Container';
import { navItems } from './navItems';

/** Top navigation header for tablet and desktop (≥ 768px). */
export function DesktopNav() {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-line bg-card/95 backdrop-blur-sm md:block">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}icons/favicon.svg`} alt="" width={36} height={36} className="flex-none" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="font-sora text-[17px] font-bold text-night">{strings.appName}</span>
            <span className="truncate text-[12px] text-muted">{strings.nav.brandSub}</span>
          </span>
        </Link>
        <nav aria-label={strings.nav.label}>
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {navItems.map(({ to, label, Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-[14.5px] transition-colors ${
                      isActive
                        ? 'bg-teal-soft font-semibold text-teal-text'
                        : 'font-medium text-sub hover:bg-page hover:text-night'
                    }`
                  }
                >
                  <Icon size={18} className="hidden lg:block" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
