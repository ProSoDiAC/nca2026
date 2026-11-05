import { readStore, writeStore } from './storage';
import { todayInRome } from './dates';

interface StoredDay {
  day: string;
  /** Date (Europe/Rome) on which the user made the choice. */
  pickedOn: string;
}

/**
 * Day shown when a screen opens:
 * 1. a day the user picked earlier today (so switching tabs or reopening keeps it);
 * 2. otherwise today, if today is a conference day;
 * 3. otherwise the last day the user picked;
 * 4. otherwise the first conference day.
 */
export function initialDay(key: string, days: string[]): string {
  const today = todayInRome();
  const stored = readStore<StoredDay | null>(key, null);
  const valid = stored && days.includes(stored.day) ? stored : null;
  if (valid && valid.pickedOn === today) return valid.day;
  if (days.includes(today)) return today;
  if (valid) return valid.day;
  return days[0];
}

export function rememberDay(key: string, day: string) {
  writeStore(key, { day, pickedOn: todayInRome() } satisfies StoredDay);
}
