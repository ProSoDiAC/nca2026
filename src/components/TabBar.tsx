import { NavLink } from 'react-router-dom';
import { strings } from '../strings';
import { IconCalendar, IconHome, IconNews, IconPeople } from './icons';

const tabs = [
  { to: '/', label: strings.nav.home, Icon: IconHome, end: true },
  { to: '/program', label: strings.nav.program, Icon: IconCalendar, end: false },
  { to: '/news', label: strings.nav.news, Icon: IconNews, end: false },
  { to: '/sessions', label: strings.nav.sessions, Icon: IconPeople, end: false },
];

export function TabBar() {
  return (
    <nav
      aria-label={strings.nav.label}
      className="grid flex-none grid-cols-4 border-t border-line bg-card"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map(({ to, label, Icon, end }) => (
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
