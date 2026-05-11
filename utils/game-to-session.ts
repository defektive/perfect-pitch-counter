import type { SessionRecord } from '@/hooks/use-session-history';

export interface GameStateSnapshot {
  totalStrikes: number;
  totalBalls: number;
  hitCount: number;
  walkCount: number;
  outCount: number;
  totalPitches: number;
  strikePercentage: number;
  ballPercentage: number;
  gameStarted?: string;
}

/**
 * Turn a live game snapshot into the input for `useSessionHistory.addSession`,
 * or return null if there's nothing worth archiving (no pitches AND no hits).
 * The `now` argument is taken explicitly so tests can pin the timestamp.
 */
export function gameToSessionInput(
  state: GameStateSnapshot,
  now: Date
): Omit<SessionRecord, 'id'> | null {
  if (state.totalPitches === 0 && state.hitCount === 0) return null;

  const endedAt = now.toISOString();
  const startedAt = state.gameStarted ?? endedAt;
  const durationMs = state.gameStarted
    ? Math.max(0, now.getTime() - Date.parse(state.gameStarted))
    : 0;

  return {
    startedAt,
    endedAt,
    durationMs,
    totals: {
      strikes: state.totalStrikes,
      balls: state.totalBalls,
      hits: state.hitCount,
      walks: state.walkCount,
      outs: state.outCount,
      pitches: state.totalPitches,
      strikePercentage: state.strikePercentage,
      ballPercentage: state.ballPercentage,
    },
  };
}
