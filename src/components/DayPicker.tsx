import { dayNumber } from '../lib/dates';
import { strings } from '../strings';

interface Day {
  date: string;
  dow: string;
}

/** Program variant: tall tiles with weekday + big date number. Sessions variant: compact "Tue 10" buttons. */
export function DayPicker({
  days,
  value,
  onChange,
  variant,
}: {
  days: Day[];
  value: string | null;
  onChange: (date: string) => void;
  variant: 'tall' | 'compact';
}) {
  return (
    <div role="group" aria-label={strings.program.dayGroup} className="grid grid-cols-4 gap-2">
      {days.map((d) => {
        const selected = d.date === value;
        const colors = selected ? 'bg-night text-white' : 'bg-card text-night';
        return variant === 'tall' ? (
          <button
            key={d.date}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(d.date)}
            className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 rounded-[14px] border-0 p-0 ${colors}`}
          >
            <span className="text-xs font-medium">{d.dow}</span>
            <span className="font-sora text-[22px] font-bold leading-none">{dayNumber(d.date)}</span>
          </button>
        ) : (
          <button
            key={d.date}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(d.date)}
            className={`min-h-[44px] rounded-xl border-0 p-0 text-sm font-semibold ${colors}`}
          >
            {d.dow} {dayNumber(d.date)}
          </button>
        );
      })}
    </div>
  );
}
