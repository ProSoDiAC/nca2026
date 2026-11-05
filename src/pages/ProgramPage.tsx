import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../lib/data';
import { initialDay, rememberDay } from '../lib/initialDay';
import { readStore, writeStore } from '../lib/storage';
import type { ProgramEntry } from '../lib/schema';
import { strings } from '../strings';
import { PageHeader } from '../components/PageHeader';
import { DayPicker } from '../components/DayPicker';
import { IconChevronRight } from '../components/icons';

const DAY_KEY = 'nca2026.program.day';
const ROOM_KEY = 'nca2026.program.room';
const t = strings.program;

function TimeCol({ start, end }: { start: string; end?: string }) {
  return (
    <div className="flex w-11 flex-none flex-col gap-0.5 pt-0.5">
      <span className="text-sm font-semibold">{start}</span>
      {end && <span className="text-xs text-tab">{end}</span>}
    </div>
  );
}

export function ProgramPage() {
  const { program, sessionsById } = useData();
  const dayDates = program.days.map((d) => d.date);

  const rooms = useMemo(() => {
    const set = new Set(program.entries.map((e) => e.room).filter((r) => r !== 'all'));
    return [...set].sort();
  }, [program]);

  const [day, setDay] = useState(() => initialDay(DAY_KEY, dayDates));
  const [room, setRoom] = useState(() => {
    const stored = readStore<string | null>(ROOM_KEY, null);
    return stored && rooms.includes(stored) ? stored : rooms[0] ?? 'A';
  });

  const pickDay = (d: string) => {
    setDay(d);
    rememberDay(DAY_KEY, d);
  };
  const pickRoom = (r: string) => {
    setRoom(r);
    writeStore(ROOM_KEY, r);
  };

  const items = useMemo(
    () =>
      program.entries
        .map((e, i) => ({ e, i }))
        .filter(({ e }) => e.day === day && (e.room === room || e.room === 'all'))
        .sort((a, b) => a.e.start.localeCompare(b.e.start) || a.i - b.i)
        .map(({ e }) => e),
    [program, day, room],
  );

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle}>
        <DayPicker days={program.days} value={day} onChange={pickDay} variant="tall" />
        <div role="group" aria-label={t.roomGroup} className="grid grid-cols-2 gap-1 rounded-[14px] bg-frame p-1">
          {rooms.map((r) => {
            const selected = r === room;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={selected}
                onClick={() => pickRoom(r)}
                className={`min-h-[44px] rounded-[11px] border-0 p-0 text-sm font-semibold ${
                  selected ? 'bg-card text-night' : 'bg-transparent text-sub'
                }`}
              >
                {strings.roomLabel(r)}
              </button>
            );
          })}
        </div>
      </PageHeader>

      <ol className="m-0 flex min-h-0 flex-1 list-none flex-col gap-3 overflow-y-auto px-5 pb-5 pt-1">
        {items.length === 0 && <li className="py-8 text-center text-sm text-muted">{t.empty}</li>}
        {items.map((e) => (
          <li key={`${e.day}-${e.room}-${e.start}-${e.type}`} className="flex items-start gap-3">
            <ProgramRow entry={e} room={room} sessionsById={sessionsById} />
          </li>
        ))}
      </ol>
    </>
  );
}

function ProgramRow({
  entry: e,
  room,
  sessionsById,
}: {
  entry: ProgramEntry;
  room: string;
  sessionsById: ReturnType<typeof useData>['sessionsById'];
}) {
  if (e.type === 'break') {
    return (
      <>
        <TimeCol start={e.start} />
        <div className="flex min-h-[32px] flex-1 items-center border-b border-dashed border-dash pb-1.5 text-[13.5px] text-sub">
          {e.title}
        </div>
      </>
    );
  }

  const where = strings.roomLabel(e.room === 'all' ? room : e.room);

  if (e.type === 'session') {
    const session = sessionsById.get(e.sessionId);
    return (
      <>
        <TimeCol start={e.start} end={e.end} />
        <Link
          to={`/sessions?id=${encodeURIComponent(e.sessionId)}`}
          aria-label={`${t.openSession(e.sessionId)}: ${session?.title ?? ''}`}
          className="flex min-w-0 flex-1 flex-col gap-2 rounded-card bg-card p-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-chip bg-teal-soft px-2.5 py-1 text-xs font-semibold text-teal-text">{e.sessionId}</span>
            <span className="text-xs font-medium text-sub">{where}</span>
          </div>
          <div className="font-sora text-[15px] font-semibold leading-[1.3]">{session?.title ?? ''}</div>
          <div className="flex items-center justify-between gap-2 text-[13px] text-sub">
            <span className="min-w-0">{session ? `${t.chairPrefix}${session.chair.name}` : ''}</span>
            <span className="flex flex-none items-center gap-1 font-semibold text-teal-text">
              {session ? t.papers(session.papers.length) : ''}
              <IconChevronRight />
            </span>
          </div>
        </Link>
      </>
    );
  }

  // keynote / plenary
  return (
    <>
      <TimeCol start={e.start} end={e.end} />
      <article className="flex min-w-0 flex-1 flex-col gap-2 rounded-card bg-ochre-soft p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-chip bg-night px-2.5 py-1 text-xs font-semibold text-white">
            {e.type === 'plenary' ? t.plenary : t.keynote}
          </span>
          <span className="text-xs font-medium text-sub">{where}</span>
        </div>
        <h2 className="m-0 font-sora text-[15px] font-semibold leading-[1.3]">{e.title}</h2>
        {e.speaker && <div className="text-[13px] text-sub">{e.speaker}</div>}
      </article>
    </>
  );
}
