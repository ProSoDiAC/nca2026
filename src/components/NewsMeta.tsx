import { formatIsoDate } from '../lib/dates';
import { strings } from '../strings';

export function newsDate(date: string | null) {
  return date ? formatIsoDate(date) : strings.news.datePlaceholder;
}

/** Category chip colours from the mock; unknown categories use the teal default. */
export function chipColors(category: string, featured: boolean) {
  if (featured) return 'bg-ochre text-night';
  if (category === 'Workshops') return 'bg-ochre-soft text-ochre-text';
  return 'bg-teal-soft text-teal-text';
}
