import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../lib/data';
import { initialDay, rememberDay } from '../lib/initialDay';
import { readStore, writeStore } from '../lib/storage';
import { chairsOf, isPaper, type ProgramEntry } from '../lib/schema';
import { strings } from '../strings';
import { PageHeader } from '../components/PageHeader';
import { Container, StickyBar } from '../components/Container';
import { MQ, useMediaQuery } from '../hooks/useMediaQuery';
import { DayPicker } from '../components/DayPicker';
import { IconChevronDown, IconChevronRight } from '../components/icons';

const DAY_KEY = 'nca2026.program.day';
const ROOM_KEY = 'nca2026.program.room';
const t = strings.program;

function TimeCol({ start, end }: { start: string; end?: string }) {
  return (
    <div className="flex w-11 flex-none flex-col gap-0.5 pt-0.5 md:w-14">
      <span className="text-sm font-semibold">{start}</span>
      {end && <span className="text-xs text-tab">{end}</span>}
    </div>
  );
}

const BOTH = 'both';
const spansRooms = (e: ProgramEntry) => e.room === 'all' || ('showInAllRooms' in e && !!e.showInAllRooms);

export function ProgramPage() {
  const { program, sessionsById } = useData();
  const dayDates = program.days.map((d) => d.date);
  const isDesktop = useMediaQuery(MQ.lg);

  const rooms = useMemo(() => {
    if (program.rooms) return program.rooms;
    const set = new Set(program.entries.map((e) => e.room).filter((r) => r !== 'all'));
    return [...set].sort();
  }, [program]);

  const [day, setDay] = useState(() => initialDay(DAY_KEY, dayDates));
  const [room, setRoom] = useState(() => {
    const stored = readStore<string | null>(ROOM_KEY, null);
    if (stored && (rooms.includes(stored) || stored === BOTH)) return stored;
    return window.matchMedia?.(MQ.lg).matches ? BOTH : rooms[0] ?? 'A';
  });
  // "Both rooms" exists only on desktop; on smaller screens fall back to the first room.
  const shownRoom = room === BOTH && !isDesktop ? rooms[0] : room;
  const roomOptions = isDesktop ? [BOTH, ...rooms] : rooms;

  const pickDay = (d: string) => {
    setDay(d);
    rememberDay(DAY_KEY, d);
  };
  const pickRoom = (r: string) => {
    setRoom(r);
    writeStore(ROOM_KEY, r);
  };

  const dayEntries = useMemo(
    () =>
      program.entries
        .map((e, i) => ({ e, i }))
        .filter(({ e }) => e.day === day)
        .sort((a, b) => a.e.start.localeCompare(b.e.start) || a.i - b.i)
        .map(({ e }) => e),
    [program, day],
  );
  const items = useMemo(
    () => dayEntries.filter((e) => e.room === shownRoom || spansRooms(e)),
    [dayEntries, shownRoom],
  );

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <StickyBar>
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <DayPicker days={program.days} value={day} onChange={pickDay} variant="tall" />
          <div
            role="group"
            aria-label={t.roomGroup}
            className={`grid gap-1 rounded-[14px] bg-frame p-1 md:max-w-[560px] lg:w-[420px] lg:flex-none ${
              roomOptions.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
            }`}
          >
            {roomOptions.map((r) => {
              const selected = r === shownRoom;
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickRoom(r)}
                  className={`min-h-[44px] rounded-[11px] border-0 p-0 text-sm font-semibold ${
                    selected ? 'bg-card text-night' : 'bg-transparent text-sub hover:text-night'
                  }`}
                >
                  {r === BOTH ? t.bothRooms : strings.roomLabel(r)}
                </button>
              );
            })}
          </div>
        </Container>
      </StickyBar>

      <Container className="pb-6 pt-2 md:pb-12 md:pt-4">
        {shownRoom === BOTH ? (
          <BothRooms entries={dayEntries} rooms={rooms} sessionsById={sessionsById} />
        ) : (
          <ol className="m-0 flex list-none flex-col gap-3 p-0 md:max-w-[820px] md:gap-4">
            {items.length === 0 && <li className="py-8 text-center text-sm text-muted">{t.empty}</li>}
            {items.map((e) => (
              <li key={`${e.day}-${e.room}-${e.start}-${e.type}`} className="flex items-start gap-3 md:gap-5">
                <TimeCol start={e.start} end={e.type === 'break' ? undefined : e.end} />
                <EntryCard entry={e} room={shownRoom} sessionsById={sessionsById} />
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}

/**
 * Desktop: both rooms side by side, aligned by start time.
 * Entries for everyone (breaks, keynotes, opening/closing) span both columns.
 */
function BothRooms({
  entries,
  rooms,
  sessionsById,
}: {
  entries: ProgramEntry[];
  rooms: string[];
  sessionsById: ReturnType<typeof useData>['sessionsById'];
}) {
  const starts = [...new Set(entries.map((e) => e.start))];
  return (
    <div className="grid grid-cols-[56px_repeat(2,minmax(0,1fr))] gap-x-5 gap-y-3">
      {/* Visual column headers; every card also names its room for screen readers. */}
      <div aria-hidden="true" className="contents">
        <span />
        {rooms.map((r) => (
          <span
            key={r}
            className="border-b-2 border-teal pb-2 font-sora text-[15px] font-semibold text-night"
          >
            {strings.roomLabel(r)}
          </span>
        ))}
      </div>
      {starts.map((start) => {
        const group = entries.filter((e) => e.start === start);
        const spanning = group.filter(spansRooms);
        const perRoom = group.filter((e) => !spansRooms(e));
        return (
          <div key={start} className="contents">
            {spanning.map((e) => (
              <div key={`${e.room}-${e.type}`} className="contents">
                <span>
                  <TimeCol start={e.start} end={e.type === 'break' ? undefined : e.end} />
                </span>
                <span className="col-span-2 flex">
                  <EntryCard entry={e} room={e.room === 'all' ? '' : e.room} sessionsById={sessionsById} />
                </span>
              </div>
            ))}
            {perRoom.length > 0 && (
              <div className="contents">
                <span>{spanning.every((e) => e.type === 'break') && <TimeCol start={start} end={perRoom[0].end} />}</span>
                {rooms.map((r) => {
                  const e = perRoom.find((x) => x.room === r);
                  return (
                    <span key={r} className="flex">
                      {e ? (
                        <EntryCard entry={e} room={r} sessionsById={sessionsById} />
                      ) : (
                        <span className="flex min-h-[64px] flex-1 items-center justify-center rounded-card border border-dashed border-dash text-[13px] text-tab">
                          {t.noEvent}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EntryCard({
  entry: e,
  room,
  sessionsById,
}: {
  entry: ProgramEntry;
  /** Room label to show on the card ('' = none, e.g. entries for everyone in the two-room view). */
  room: string;
  sessionsById: ReturnType<typeof useData>['sessionsById'];
}) {
  if (e.type === 'break') {
    return (
      <div className="flex min-h-[32px] min-w-0 flex-1 items-center border-b border-dashed border-dash pb-1.5 text-[13.5px] text-sub">
        {e.title}
      </div>
    );
  }

  const roomCode = e.room === 'all' ? room : e.room;
  const where = roomCode && roomCode !== BOTH ? strings.roomLabel(roomCode) : '';

  if (e.type === 'social') {
    return <SocialCard title={e.title} description={e.description} />;
  }

  if (e.type === 'session') {
    const session = sessionsById.get(e.sessionId);
    const n = session?.papers.filter(isPaper).length ?? 0;
    const chairs = session ? chairsOf(session) : [];
    return (
      <Link
        to={`/sessions?id=${encodeURIComponent(e.sessionId)}`}
        className="flex min-w-0 flex-1 flex-col gap-2 rounded-card bg-card p-3.5 transition-shadow hover:shadow-[0_2px_12px_rgba(10,37,64,0.08)] md:p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-chip bg-teal-soft px-2.5 py-1 text-xs font-semibold text-teal-text">
            {session?.code ?? e.sessionId}
          </span>
          <span className="text-xs font-medium text-sub">{where}</span>
        </div>
        <div className="break-words font-sora text-[15px] font-semibold leading-[1.3] md:text-base">{session?.title ?? ''}</div>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[13px] text-sub">
          <span className="min-w-0">{chairs.length ? `${t.chairPrefix}${chairs.map((c) => c.name).join(', ')}` : ''}</span>
          <span className="ml-auto flex flex-none items-center gap-1 font-semibold text-teal-text">
            {n > 0 ? t.papers(n) : t.details}
            <IconChevronRight />
          </span>
        </div>
      </Link>
    );
  }

  // keynote / plenary
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-2 rounded-card bg-ochre-soft p-3.5 md:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-chip bg-night px-2.5 py-1 text-xs font-semibold text-white">
          {e.type === 'plenary' ? t.plenary : t.keynote}
        </span>
        <span className="text-xs font-medium text-sub">{where}</span>
      </div>
      <h2 className="m-0 break-words font-sora text-[15px] font-semibold leading-[1.3] md:text-base">{e.title ?? e.speaker}</h2>
      {e.title && e.speaker && <div className="text-[13px] text-sub">{e.speaker}</div>}
    </article>
  );
}

function SocialCard({ title, description }: { title: string; description?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const chip = (
    <span className="self-start rounded-chip bg-leaf-text px-2.5 py-1 text-xs font-semibold text-white">{t.social}</span>
  );
  const heading = <span className="font-sora text-[15px] font-semibold leading-[1.3]">{title}</span>;
  if (!description) {
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-card bg-leaf-soft p-3.5">
        {chip}
        {heading}
      </div>
    );
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col self-start rounded-card bg-leaf-soft">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex flex-col gap-2 border-0 bg-transparent p-3.5 text-left text-night"
      >
        {chip}
        {heading}
        <span className="flex items-center gap-1 text-[13px] font-semibold text-leaf-text">
          {open ? t.lessInfo : t.moreInfo}
          <span className={`flex transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <IconChevronDown size={16} />
          </span>
        </span>
      </button>
      {open && (
        <div id={id} className="flex flex-col gap-2.5 px-3.5 pb-3.5">
          {description.split(/\n{2,}/).map((para, i) => {
            // A paragraph whose first line is followed by a line break gets that line as a bold heading.
            const [first, ...rest] = para.split('\n');
            return (
              <p key={i} className="m-0 text-[13.5px] leading-[1.55] text-body">
                {rest.length ? (
                  <>
                    <strong className="block font-semibold text-night">{first}</strong>
                    {rest.join(' ')}
                  </>
                ) : (
                  para
                )}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
