import { NavLink } from 'react-router-dom';
import { strings } from '../strings';
import { navItems } from './navItems';

/** Bottom navigation for phones (< 768px). Hidden from tablet up, where DesktopNav takes over. */
export function TabBar() {
  return (
    <nav
      aria-label={strings.nav.label}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-card md:hidden"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {navItems.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-h-[56px] flex-col items-center justify-center gap-1 border-t-[3px] text-[11px] ${
              isActive ? 'border-teal font-semibold text-night' : 'border-transparent font-medium text-tab'
            }`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
