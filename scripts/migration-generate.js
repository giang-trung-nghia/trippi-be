const { spawnSync } = require('child_process');
const path = require('path');

const [, , migrationName] = process.argv;

if (!migrationName) {
  console.error(
    'Please provide a migration file name. Example: yarn migration:generate create-users-table',
  );
  process.exit(1);
}

const migrationPath = path.posix.join(
  'src',
  'database',
  'migrations',
  migrationName,
);

const dataSourcePath = path.posix.join(
  'src',
  'config',
  'database.config.ts',
);

const args = [
  '-r',
  'tsconfig-paths/register',
  path.join('node_modules', 'typeorm', 'cli.js'),
  'migration:generate',
  migrationPath,
  '-d',
  dataSourcePath,
];

const result = spawnSync('ts-node-dev', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);

