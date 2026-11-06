import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected a date like 2026-11-10');
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, 'expected a time like 09:00');
const room = z.string().min(1);

const showInAllRooms = z.boolean().optional();

export const programSchema = z.object({
  /** Order of the room toggle; the first one is selected by default. Defaults to the rooms found in entries. */
  rooms: z.array(room).min(1).optional(),
  days: z.array(z.object({ date: isoDate, dow: z.string().min(1) })).min(1),
  entries: z.array(
    z.discriminatedUnion('type', [
      z.object({ type: z.literal('break'), day: isoDate, room, start: hhmm, end: hhmm, title: z.string() }),
      z.object({ type: z.literal('social'), day: isoDate, room, start: hhmm, end: hhmm, title: z.string(), description: z.string().optional() }),
      z.object({ type: z.literal('session'), day: isoDate, room, start: hhmm, end: hhmm, sessionId: z.string().min(1), showInAllRooms }),
      z.object({
        type: z.enum(['keynote', 'plenary']),
        day: isoDate,
        room,
        start: hhmm,
        end: hhmm,
        title: z.string().optional(),
        speaker: z.string().optional(),
        showInAllRooms,
      }),
    ]),
  ),
});

const person = z.object({ name: z.string(), affiliation: z.string().optional(), tbc: z.boolean().optional() });

export const sessionsSchema = z.object({
  sessions: z.array(
    z.object({
      id: z.string().min(1),
      /** Short label for the chip, e.g. "S1", "W3". Falls back to the id. */
      code: z.string().min(1).optional(),
      kind: z.enum(['session', 'workshop', 'industry', 'phd', 'demo']).optional(),
      day: isoDate,
      room,
      start: hhmm,
      end: hhmm,
      /** When a session is split by a break (e.g. a workshop over two slots). */
      slots: z.array(z.object({ start: hhmm, end: hhmm })).optional(),
      title: z.string(),
      /** One chair, or a list when a session has more than one. `tbc: true` = not yet confirmed. */
      chair: z.union([person, z.array(person)]).nullable().optional(),
      /**
       * The session's running order. Items without `kind` (or kind "paper") are papers;
       * workshops can also list headings (sub-sessions), keynotes, talks (opening/closing) and breaks.
       */
      papers: z.array(
        z.object({
          kind: z.enum(['paper', 'heading', 'keynote', 'talk', 'break']).optional(),
          time: hhmm.optional(),
          end: hhmm.optional(),
          title: z.string(),
          authors: z.string().optional(),
        }),
      ),
    }),
  ),
});

export const newsSchema = z.object({
  news: z.array(
    z.object({
      id: z.string().min(1),
      date: isoDate.nullable(),
      category: z.string(),
      title: z.string(),
      summary: z.string(),
      body: z.string(),
    }),
  ),
});

export type Program = z.infer<typeof programSchema>;
export type ProgramEntry = Program['entries'][number];
export type Session = z.infer<typeof sessionsSchema>['sessions'][number];
export type SessionItem = Session['papers'][number];
export type Chair = z.infer<typeof person>;
export const chairsOf = (s: Session): Chair[] => (!s.chair ? [] : Array.isArray(s.chair) ? s.chair : [s.chair]);
export const isPaper = (p: SessionItem) => !p.kind || p.kind === 'paper';
export type NewsItem = z.infer<typeof newsSchema>['news'][number];
