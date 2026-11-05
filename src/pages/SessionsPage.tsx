import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../lib/data';
import { initialDay, rememberDay } from '../lib/initialDay';
import { dayNumber } from '../lib/dates';
import type { Session } from '../lib/schema';
import { strings } from '../strings';
import { PageHeader } from '../components/PageHeader';
import { DayPicker } from '../components/DayPicker';
import { IconChevronDown, IconClose, IconPerson, IconSearch } from '../components/icons';

const DAY_KEY = 'nca2026.sessions.day';
const t = strings.sessions;

const norm = (x: string) =>
  x
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function haystack(s: Session) {
  return norm(
    [s.id, s.code ?? '', s.title, s.chair?.name ?? '', s.chair?.affiliation ?? '', ...s.papers.flatMap((p) => [p.title, p.authors])].join(' \n '),
  );
}

export function SessionsPage() {
  const { program, sessions, sessionsById } = useData();
  const [params, setParams] = useSearchParams();
  const dayDates = program.days.map((d) => d.date);
  const dowByDate = useMemo(() => new Map(program.days.map((d) => [d.date, d.dow])), [program]);

  const linked = params.get('id');
  const linkedSession = linked ? sessionsById.get(linked) : undefined;

  const [day, setDay] = useState(() => linkedSession?.day ?? initialDay(DAY_KEY, dayDates));
  const [openId, setOpenId] = useState<string | null>(linkedSession?.id ?? null);
  const [query, setQuery] = useState('');
  const [missing] = useState(() => (linked && !linkedSession ? linked : null));

  const listRef = useRef<HTMLDivElement>(null);
  const didScroll = useRef(false);

  // Bring a deep-linked session into view once.
  useEffect(() => {
    if (didScroll.current || !linkedSession) return;
    didScroll.current = true;
    const el = document.getElementById(`session-${linkedSession.id}`);
    if (el && listRef.current) {
      listRef.current.scrollTop = el.offsetTop - listRef.current.offsetTop - 4;
    }
  }, [linkedSession]);

  // Keep ?id= in sync with the open session, so refresh/share keeps it.
  useEffect(() => {
    const current = params.get('id');
    if ((openId ?? null) !== current) {
      setParams(openId ? { id: openId } : {}, { replace: true });
    }
  }, [openId, params, setParams]);

  const index = useMemo(() => new Map(sessions.map((s) => [s.id, haystack(s)])), [sessions]);
  const q = norm(query.trim());
  const searching = q.length > 0;

  const list = useMemo(() => {
    const byTime = (a: Session, b: Session) =>
      a.day.localeCompare(b.day) || a.start.localeCompare(b.start) || a.room.localeCompare(b.room);
    if (searching) return sessions.filter((s) => index.get(s.id)!.includes(q)).sort(byTime);
    return sessions.filter((s) => s.day === day).sort(byTime);
  }, [sessions, index, q, searching, day]);

  const pickDay = (d: string) => {
    setDay(d);
    rememberDay(DAY_KEY, d);
    setQuery('');
    setOpenId(null);
  };

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle}>
        <div className="relative">
          <label htmlFor="session-search" className="sr-only">
            {t.searchLabel}
          </label>
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tab" />
          <input
            id="session-search"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder={t.searchPlaceholder}
            className="min-h-[44px] w-full rounded-xl border border-line bg-card py-2 pl-10 pr-11 text-[15px] text-night placeholder:text-tab [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-sub"
            >
              <IconClose />
            </button>
          )}
        </div>
        <DayPicker days={program.days} value={searching ? null : day} onChange={pickDay} variant="compact" />
      </PageHeader>

      <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-5 pt-1">
        {missing && !searching && (
          <p className="m-0 rounded-card bg-ochre-soft p-3 text-sm text-ochre-text" role="status">
            {t.notFound(missing)}
          </p>
        )}
        {searching && (
          <p className="m-0 text-[13px] text-muted" role="status" aria-live="polite">
            {list.length ? t.results(list.length) : t.noResults}
          </p>
        )}
        {!searching && list.length === 0 && <p className="py-8 text-center text-sm text-muted">{t.empty}</p>}
        {list.map((s) => (
          <SessionItem
            key={s.id}
            session={s}
            dow={dowByDate.get(s.day) ?? ''}
            open={openId === s.id}
            onToggle={() => setOpenId((cur) => (cur === s.id ? null : s.id))}
          />
        ))}
      </div>
    </>
  );
}

function SessionItem({ session: s, dow, open, onToggle }: { session: Session; dow: string; open: boolean; onToggle: () => void }) {
  const panelId = `session-panel-${s.id}`;
  const times = (s.slots ?? [{ start: s.start, end: s.end }]).map((x) => `${x.start} – ${x.end}`).join(', ');
  const meta = `${dow} ${dayNumber(s.day)} · ${times} · ${strings.roomLabel(s.room)}`;
  return (
    <section id={`session-${s.id}`} className="flex-none overflow-hidden rounded-[18px] bg-card">
      <h2 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[72px] w-full items-center gap-3 border-0 bg-transparent px-4 py-3.5 text-left text-night"
        >
          <span className="min-w-[40px] flex-none rounded-[10px] bg-teal-soft px-2 py-1.5 text-center text-[13px] font-semibold text-teal-text">
            {s.code ?? s.id}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-sora text-[15px] font-semibold">{s.title}</span>
            <span className="text-[12.5px] font-normal text-muted">{meta}</span>
          </span>
          <span className={`flex flex-none text-sub transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <IconChevronDown />
          </span>
        </button>
      </h2>
      {open && (
        <div id={panelId} className="flex flex-col gap-3.5 px-4 pb-4">
          {s.chair && (
          <div className="flex items-center gap-3 rounded-[14px] bg-page p-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-chip bg-night text-ochre">
              <IconPerson size={20} />
            </span>
            <span className="flex flex-col gap-px">
              <span className="text-xs font-semibold uppercase tracking-[0.05em] text-tab">{t.chair}</span>
              <span className="text-[15px] font-semibold">{s.chair.name}</span>
              {s.chair.affiliation && <span className="text-[13px] text-muted">{s.chair.affiliation}</span>}
            </span>
          </div>
          )}
          {s.papers.length === 0 && <p className="m-0 text-sm text-muted">{t.papersTba}</p>}
          <ol className="m-0 flex list-none flex-col p-0">
            {s.papers.map((p, i) => (
              <li key={i} className="flex gap-3 border-t border-divider py-3">
                {p.time && <span className="w-11 flex-none text-[13px] font-semibold text-teal-text">{p.time}</span>}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[14.5px] font-medium leading-[1.35]">{p.title}</span>
                  <span className="text-[13px] text-muted">{p.authors}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
