import type { MigrationStep } from '../migrate.js';
import { migrateV1ToV6 } from './v1-to-v6.js';
import { migrateV6ToV7 } from './v6-to-v7.js';
import { migrateV7ToV8 } from './v7-to-v8.js';
import { migrateV8ToV9 } from './v8-to-v9.js';
import { migrateV9ToV10 } from './v9-to-v10.js';

/**
 * Registry of ordered migration steps.
 * Each step defines a migration from one version to the next.
 */
export const MIGRATION_STEPS: MigrationStep[] = [
  {
    from: 'v1',
    to: 'v6',
    exec: migrateV1ToV6,
  },
  {
    from: 'v6',
    to: 'v7',
    exec: migrateV6ToV7,
  },
  {
    from: 'v7',
    to: 'v8',
    exec: migrateV7ToV8,
  },
  {
    from: 'v8',
    to: 'v9',
    exec: migrateV8ToV9,
  },
  {
    from: 'v9',
    to: 'v10',
    exec: migrateV9ToV10,
  },
];
