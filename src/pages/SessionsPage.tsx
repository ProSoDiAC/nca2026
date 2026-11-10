import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../lib/data';
import { initialDay, rememberDay } from '../lib/initialDay';
import { dayNumber } from '../lib/dates';
import { chairsOf, type Session, type SessionItem } from '../lib/schema';
import { strings } from '../strings';
import { PageHeader } from '../components/PageHeader';
import { Container, StickyBar } from '../components/Container';
import { MQ, useMediaQuery } from '../hooks/useMediaQuery';
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
    [s.id, s.code ?? '', s.title, ...chairsOf(s).flatMap((c) => [c.name, c.affiliation ?? '']), ...s.papers.flatMap((p) => [p.title, p.authors ?? ''])].join(' \n '),
  );
}

export function SessionsPage() {
  const { program, sessions, sessionsById } = useData();
  const [params, setParams] = useSearchParams();
  const isDesktop = useMediaQuery(MQ.lg);
  const dayDates = program.days.map((d) => d.date);
  const dowByDate = useMemo(() => new Map(program.days.map((d) => [d.date, d.dow])), [program]);

  const linked = params.get('id');
  const linkedSession = linked ? sessionsById.get(linked) : undefined;

  const [day, setDay] = useState(() => linkedSession?.day ?? initialDay(DAY_KEY, dayDates));
  const [openId, setOpenId] = useState<string | null>(linkedSession?.id ?? null);
  const [query, setQuery] = useState('');
  const [missing] = useState(() => (linked && !linkedSession ? linked : null));

  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  const scrollTo = useRef<string | null>(linkedSession?.id ?? null);
  const lastOpen = useRef<string | null>(openId);

  // Track the sticky bar's height: the desktop detail panel sticks right below it.
  useEffect(() => {
    const el = barRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setBarHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The URL's ?id= changed from outside (back/forward, a new link): follow it.
  useEffect(() => {
    if (!linkedSession || linkedSession.id === lastOpen.current) return;
    setDay(linkedSession.day);
    setQuery('');
    setOpenId(linkedSession.id);
    scrollTo.current = linkedSession.id;
  }, [linkedSession]);

  // Keep ?id= in sync when the user opens/closes a session, so refresh/share keeps it.
  useEffect(() => {
    if (lastOpen.current === openId) return;
    lastOpen.current = openId;
    if ((params.get('id') ?? null) !== openId) setParams(openId ? { id: openId } : {}, { replace: true });
  }, [openId, params, setParams]);

  // Bring a deep-linked session into view, just below the sticky bar.
  useEffect(() => {
    const id = scrollTo.current;
    if (!id || openId !== id) return;
    scrollTo.current = null;
    const el = document.getElementById(`session-${id}`);
    const bar = barRef.current;
    if (!el) return;
    const offset = bar ? parseFloat(getComputedStyle(bar).top || '0') + bar.offsetHeight + 8 : 8;
    const r = el.getBoundingClientRect();
    // Already fully visible below the sticky bar (e.g. short desktop lists): leave the page where it is.
    if (r.top >= offset && r.bottom <= window.innerHeight) return;
    window.scrollTo({ top: Math.max(0, r.top + window.scrollY - offset) });
  }, [openId, day]);

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

  const metaOf = (s: Session) => {
    const times = (s.slots ?? [{ start: s.start, end: s.end }]).map((x) => `${x.start} – ${x.end}`).join(', ');
    return `${dowByDate.get(s.day) ?? ''} ${dayNumber(s.day)} · ${times} · ${strings.roomLabel(s.room)}`;
  };
  const selected = openId ? sessionsById.get(openId) : undefined;

  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <StickyBar ref={barRef}>
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="relative w-full md:max-w-[560px] lg:max-w-[420px]">
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
        </Container>
      </StickyBar>

      <Container className="flex flex-col gap-3 pb-6 pt-2 md:pb-12 md:pt-4">
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

        {isDesktop ? (
          // Desktop: list on the left, details of the selected session on the right.
          <div className="grid grid-cols-[minmax(320px,400px)_minmax(0,1fr)] items-start gap-6 xl:gap-8">
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {list.map((s) => (
                <li key={s.id} id={`session-${s.id}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId(s.id)}
                    aria-current={openId === s.id ? 'true' : undefined}
                    aria-controls="session-detail"
                    className={`flex w-full items-center gap-3 rounded-[18px] border-2 px-4 py-3.5 text-left text-night transition-colors ${
                      openId === s.id ? 'border-teal bg-card' : 'border-transparent bg-card hover:border-line'
                    }`}
                  >
                    <SessionHeading session={s} meta={metaOf(s)} />
                  </button>
                </li>
              ))}
            </ul>
            <section
              id="session-detail"
              aria-label={t.detailLabel}
              aria-live="polite"
              className="sticky flex flex-col gap-4 overflow-y-auto rounded-[20px] bg-card p-6"
              style={{
                top: `calc(64px + ${barHeight}px + 16px)`,
                maxHeight: `calc(100dvh - 64px - ${barHeight}px - 32px)`,
              }}
            >
              {selected ? (
                <>
                  <div className="flex items-start gap-3">
                    <CodeChip session={selected} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <h2 className="m-0 break-words font-sora text-xl font-semibold leading-[1.3]">{selected.title}</h2>
                      <p className="m-0 text-[13.5px] text-muted">{metaOf(selected)}</p>
                    </div>
                  </div>
                  <SessionDetail session={selected} />
                </>
              ) : (
                <p className="m-0 py-10 text-center text-sm text-muted">{t.selectPrompt}</p>
              )}
            </section>
          </div>
        ) : (
          // Phones and tablets: accordion, one session open at a time.
          list.map((s) => (
            <SessionAccordion
              key={s.id}
              session={s}
              meta={metaOf(s)}
              open={openId === s.id}
              onToggle={() => setOpenId((cur) => (cur === s.id ? null : s.id))}
            />
          ))
        )}
      </Container>
    </>
  );
}

function CodeChip({ session: s }: { session: Session }) {
  return (
    <span className="min-w-[40px] flex-none rounded-[10px] bg-teal-soft px-2 py-1.5 text-center text-[13px] font-semibold text-teal-text">
      {s.code ?? s.id}
    </span>
  );
}

function SessionHeading({ session: s, meta }: { session: Session; meta: string }) {
  return (
    <>
      <CodeChip session={s} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="break-words font-sora text-[15px] font-semibold">{s.title}</span>
        <span className="text-[12.5px] font-normal text-muted">{meta}</span>
      </span>
    </>
  );
}

function SessionAccordion({
  session: s,
  meta,
  open,
  onToggle,
}: {
  session: Session;
  meta: string;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `session-panel-${s.id}`;
  return (
    <section id={`session-${s.id}`} className="flex-none overflow-hidden rounded-[18px] bg-card">
      <h2 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[72px] w-full items-center gap-3 border-0 bg-transparent px-4 py-3.5 text-left text-night md:px-5"
        >
          <SessionHeading session={s} meta={meta} />
          <span className={`flex flex-none text-sub transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <IconChevronDown />
          </span>
        </button>
      </h2>
      {open && (
        <div id={panelId} className="flex flex-col gap-3.5 px-4 pb-4 md:px-5 md:pb-5">
          <SessionDetail session={s} />
        </div>
      )}
    </section>
  );
}

/** Chair block + running order. Shared by the phone accordion and the desktop detail panel. */
function SessionDetail({ session: s }: { session: Session }) {
  const chairs = chairsOf(s);
  return (
    <>
      {chairs.length > 0 && (
        <div className="flex flex-col gap-2.5 rounded-[14px] bg-page p-3 md:p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.05em] text-tab">
            {chairs.length > 1 ? t.chairs : t.chair}
          </span>
          <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-x-8">
            {chairs.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-chip bg-night text-ochre">
                  <IconPerson size={20} />
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[15px] font-semibold">{c.name}</span>
                  {c.affiliation && <span className="text-[13px] text-muted">{c.affiliation}</span>}
                  {c.tbc && <span className="text-xs font-semibold text-ochre-text">{t.tbc}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {s.papers.length === 0 && <p className="m-0 text-sm text-muted">{t.papersTba}</p>}
      {s.papers.some((p) => p.presenter) && (
        <p className="m-0 flex items-center gap-2 text-[12.5px] text-muted" aria-hidden="true">
          <span className="font-medium text-body underline decoration-teal decoration-2 underline-offset-[3px]">
            {t.presenterLegendSample}
          </span>
          {t.presenterLegendText}
        </p>
      )}
      <ol className="m-0 flex list-none flex-col p-0">
        {s.papers.map((p, i) => (
          <AgendaRow key={i} item={p} />
        ))}
      </ol>
    </>
  );
}

function AgendaTime({ item }: { item: SessionItem }) {
  if (!item.time) return null;
  return (
    <span className="flex w-11 flex-none flex-col gap-0.5">
      <span className="text-[13px] font-semibold text-teal-text">{item.time}</span>
      {item.end && <span className="text-[11.5px] text-tab">{item.end}</span>}
    </span>
  );
}

function AgendaRow({ item: p }: { item: SessionItem }) {
  if (p.kind === 'heading') {
    return (
      <li className="border-t border-divider pb-1 pt-4">
        <h3 className="m-0 font-sora text-[13px] font-semibold uppercase tracking-[0.05em] text-teal-text">{p.title}</h3>
      </li>
    );
  }
  if (p.kind === 'break' || p.kind === 'talk') {
    return (
      <li className="flex items-baseline gap-3 border-t border-divider py-2.5">
        <AgendaTime item={p} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={`text-[14px] ${p.kind === 'talk' ? 'font-medium text-night' : 'text-sub'}`}>{p.title}</span>
          {p.authors && <span className="break-words text-[13px] text-muted">{p.authors}</span>}
        </span>
      </li>
    );
  }
  if (p.kind === 'keynote') {
    return (
      <li className="flex gap-3 border-t border-divider py-3">
        <AgendaTime item={p} />
        <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5 rounded-xl bg-ochre-soft p-3">
          <span className="rounded-chip bg-night px-2 py-0.5 text-[11.5px] font-semibold text-white">{strings.program.keynote}</span>
          <span className="break-words text-[14.5px] font-medium leading-[1.35]">{p.title}</span>
          {p.authors && <span className="text-[13px] text-sub">{p.authors}</span>}
        </span>
      </li>
    );
  }
  return (
    <li className="flex gap-3 border-t border-divider py-3">
      <AgendaTime item={p} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="break-words text-[14.5px] font-medium leading-[1.35]">{p.title}</span>
        {p.authors && (
          <span className="break-words text-[13px] text-muted">
            <Authors authors={p.authors} presenter={p.presenter} />
          </span>
        )}
      </span>
    </li>
  );
}

/** Author list with the presenting author underlined (and announced to screen readers). */
function Authors({ authors, presenter }: { authors: string; presenter?: string }) {
  const at = presenter ? authors.indexOf(presenter) : -1;
  if (!presenter || at < 0) return <>{authors}</>;
  return (
    <>
      {authors.slice(0, at)}
      <span className="font-medium text-body underline decoration-teal decoration-2 underline-offset-[3px]">{presenter}</span>
      <span className="sr-only"> ({t.presenter})</span>
      {authors.slice(at + presenter.length)}
    </>
  );
}
