import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { ZodType } from 'zod';
import { newsSchema, programSchema, sessionsSchema, type NewsItem, type Program, type Session } from './schema';

export interface ConferenceData {
  program: Program;
  sessions: Session[];
  sessionsById: Map<string, Session>;
  news: NewsItem[];
}

type State = { status: 'loading' } | { status: 'error'; errors: string[] } | { status: 'ready'; data: ConferenceData };

async function load<T>(file: string, schema: ZodType<T>): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error(`${file}: not valid JSON`);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .slice(0, 5)
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('; ');
    throw new Error(`${file}: ${issues}`);
  }
  return parsed.data;
}

const DataContext = createContext<{ state: State; reload: () => void }>({ state: { status: 'loading' }, reload: () => {} });

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((a) => a + 1), []);

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    Promise.allSettled([
      load('program.json', programSchema),
      load('sessions.json', sessionsSchema),
      load('news.json', newsSchema),
    ]).then(([p, s, n]) => {
      if (!alive) return;
      const errors = [p, s, n].flatMap((r) => (r.status === 'rejected' ? [String((r.reason as Error).message ?? r.reason)] : []));
      if (errors.length || p.status !== 'fulfilled' || s.status !== 'fulfilled' || n.status !== 'fulfilled') {
        setState({ status: 'error', errors });
        return;
      }
      const sessions = s.value.sessions;
      setState({
        status: 'ready',
        data: {
          program: p.value,
          sessions,
          sessionsById: new Map(sessions.map((x) => [x.id, x])),
          news: n.value.news,
        },
      });
    });
    return () => {
      alive = false;
    };
  }, [attempt]);

  return <DataContext.Provider value={{ state, reload }}>{children}</DataContext.Provider>;
}

export function useDataState() {
  return useContext(DataContext);
}

/** Only call inside <DataGate>, where data is guaranteed to be ready. */
export function useData(): ConferenceData {
  const { state } = useContext(DataContext);
  if (state.status !== 'ready') throw new Error('useData used before data was ready');
  return state.data;
}
