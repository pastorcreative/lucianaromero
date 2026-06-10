import * as migration_20260520_132935_inicial from './20260520_132935_inicial';
import * as migration_20260610_videos_pagina_inicio from './20260610_videos_pagina_inicio';

export const migrations = [
  {
    up: migration_20260520_132935_inicial.up,
    down: migration_20260520_132935_inicial.down,
    name: '20260520_132935_inicial'
  },
  {
    up: migration_20260610_videos_pagina_inicio.up,
    down: migration_20260610_videos_pagina_inicio.down,
    name: '20260610_videos_pagina_inicio'
  },
];
