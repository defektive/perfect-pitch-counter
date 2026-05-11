import { describe, it, expect } from 'vitest';
import { gameToSessionInput, type GameStateSnapshot } from '../game-to-session';

const empty: GameStateSnapshot = {
  totalStrikes: 0,
  totalBalls: 0,
  hitCount: 0,
  walkCount: 0,
  outCount: 0,
  totalPitches: 0,
  strikePercentage: 0,
  ballPercentage: 0,
};

const now = new Date('2026-05-10T01:00:00.000Z');

describe('gameToSessionInput', () => {
  it('returns null when no pitches or hits were recorded', () => {
    expect(gameToSessionInput(empty, now)).toBeNull();
  });

  it('archives a game even if pitches=0 as long as there were hits', () => {
    const result = gameToSessionInput({ ...empty, hitCount: 1 }, now);
    expect(result).not.toBeNull();
    expect(result!.totals.hits).toBe(1);
  });

  it('computes duration from gameStarted to now', () => {
    const gameStarted = '2026-05-10T00:30:00.000Z';
    const result = gameToSessionInput(
      { ...empty, totalPitches: 5, gameStarted },
      now
    );
    expect(result!.durationMs).toBe(30 * 60 * 1000);
    expect(result!.startedAt).toBe(gameStarted);
    expect(result!.endedAt).toBe(now.toISOString());
  });

  it('uses now as both started and ended when there is no gameStarted', () => {
    const result = gameToSessionInput({ ...empty, totalPitches: 1 }, now);
    expect(result!.startedAt).toBe(now.toISOString());
    expect(result!.endedAt).toBe(now.toISOString());
    expect(result!.durationMs).toBe(0);
  });

  it('clamps a negative duration to zero', () => {
    const result = gameToSessionInput(
      { ...empty, totalPitches: 1, gameStarted: '2030-01-01T00:00:00.000Z' },
      now
    );
    expect(result!.durationMs).toBe(0);
  });

  it('maps all totals through', () => {
    const result = gameToSessionInput(
      {
        totalStrikes: 12,
        totalBalls: 8,
        hitCount: 3,
        walkCount: 1,
        outCount: 4,
        totalPitches: 23,
        strikePercentage: 52,
        ballPercentage: 35,
      },
      now
    );
    expect(result!.totals).toEqual({
      strikes: 12,
      balls: 8,
      hits: 3,
      walks: 1,
      outs: 4,
      pitches: 23,
      strikePercentage: 52,
      ballPercentage: 35,
    });
  });
});
