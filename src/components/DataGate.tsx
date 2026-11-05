import type { ReactNode } from 'react';
import { useDataState } from '../lib/data';
import { strings } from '../strings';

export function DataGate({ children }: { children: ReactNode }) {
  const { state, reload } = useDataState();
  if (state.status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted" role="status">
        {strings.states.loading}
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div className="flex flex-1 flex-col justify-center gap-4 px-5" role="alert">
        <h1 className="font-sora text-xl font-semibold">{strings.states.errorTitle}</h1>
        <p className="text-sm text-muted">{strings.states.errorHint}</p>
        <ul className="flex flex-col gap-2">
          {state.errors.map((e) => (
            <li key={e} className="break-words rounded-card bg-card p-3 font-mono text-[13px] text-body">
              {e}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={reload}
          className="min-h-[48px] rounded-[14px] bg-night px-4 text-[15px] font-semibold text-white"
        >
          {strings.states.retry}
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
