import * as migration_20251016_054814 from './20251016_054814';

export const migrations = [
  {
    up: migration_20251016_054814.up,
    down: migration_20251016_054814.down,
    name: '20251016_054814'
  },
];
