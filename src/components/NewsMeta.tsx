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

/** Red-ish "Important" label, shown before the category chip. */
export function ImportantChip({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      className={`rounded-chip px-2.5 py-1 text-xs font-bold uppercase tracking-[0.04em] ${
        onDark ? 'bg-white text-alert' : 'bg-alert text-white'
      }`}
    >
      {strings.news.important}
    </span>
  );
}
