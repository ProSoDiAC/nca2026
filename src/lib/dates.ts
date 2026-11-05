import { strings } from '../strings';

export const CONFERENCE_TZ = 'Europe/Rome';

/** Today's date in the conference time zone, as ISO yyyy-mm-dd. */
export function todayInRome(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: CONFERENCE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Day of month from an ISO date string, without going through Date (device time zone independent). */
export function dayNumber(iso: string): string {
  return String(Number(iso.slice(8, 10)));
}

/** "2026-11-10" -> "10 Nov 2026". Pure string formatting, device time zone independent. */
export function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${strings.months[m - 1] ?? ''} ${y}`;
}
