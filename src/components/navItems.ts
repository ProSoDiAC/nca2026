import { strings } from '../strings';
import { IconCalendar, IconHome, IconNews, IconPeople } from './icons';

/** The four sections, shared by the phone tab bar and the desktop header. */
export const navItems = [
  { to: '/', label: strings.nav.home, Icon: IconHome, end: true },
  { to: '/program', label: strings.nav.program, Icon: IconCalendar, end: false },
  { to: '/news', label: strings.nav.news, Icon: IconNews, end: false },
  { to: '/sessions', label: strings.nav.sessions, Icon: IconPeople, end: false },
];
