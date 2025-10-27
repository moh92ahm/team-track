import * as migration_20251027_134346 from './20251027_134346';
import * as migration_create_super_admin from './create-super-admin';

export const migrations = [
  {
    up: migration_20251027_134346.up,
    down: migration_20251027_134346.down,
    name: '20251027_134346'
  },
  {
    up: migration_create_super_admin.up,
    down: migration_create_super_admin.down,
    name: 'create_super_admin'
  },
];
