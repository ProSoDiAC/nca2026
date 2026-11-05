import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected a date like 2026-11-10');
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, 'expected a time like 09:00');
const room = z.string().min(1);

export const programSchema = z.object({
  days: z.array(z.object({ date: isoDate, dow: z.string().min(1) })).min(1),
  entries: z.array(
    z.discriminatedUnion('type', [
      z.object({ type: z.literal('break'), day: isoDate, room, start: hhmm, end: hhmm, title: z.string() }),
      z.object({ type: z.literal('session'), day: isoDate, room, start: hhmm, end: hhmm, sessionId: z.string().min(1) }),
      z.object({
        type: z.enum(['keynote', 'plenary']),
        day: isoDate,
        room,
        start: hhmm,
        end: hhmm,
        title: z.string(),
        speaker: z.string().optional(),
      }),
    ]),
  ),
});

export const sessionsSchema = z.object({
  sessions: z.array(
    z.object({
      id: z.string().min(1),
      day: isoDate,
      room,
      start: hhmm,
      end: hhmm,
      title: z.string(),
      chair: z.object({ name: z.string(), affiliation: z.string() }),
      papers: z.array(z.object({ time: hhmm, title: z.string(), authors: z.string() })),
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
export type NewsItem = z.infer<typeof newsSchema>['news'][number];
