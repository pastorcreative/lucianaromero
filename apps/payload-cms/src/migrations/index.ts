import * as migration_20260520_132935_inicial from './20260520_132935_inicial';

export const migrations = [
  {
    up: migration_20260520_132935_inicial.up,
    down: migration_20260520_132935_inicial.down,
    name: '20260520_132935_inicial'
  },
];
