/* eslint-disable @typescript-eslint/no-var-requires */
const { execute, sortLines } = require('./index.ts');
const { migration_name } = require('./migration-name.ts');
const fs = require('fs');
const progress = require('progress');
const chalk = require('chalk');

const dir = process.cwd() + '/prisma/migrations';

const total = fs.readdirSync(dir);

const path = process.cwd() + '/prisma/schema.prisma';
const dev_path = process.cwd() + '/prisma/schema-dev.prisma';

const schema = fs.readFileSync(path, 'utf-8');
const schema_dev = fs.readFileSync(dev_path, 'utf-8');

if (sortLines(schema) !== sortLines(schema_dev)) {
  if (total.length - 1 === migration_name.length) {
    console.log(
      chalk.red(
        'Warning: New migration found but name does not provided'.toUpperCase(),
      ),
    );
  } else {
    const itemsToProcess = new Array(5).fill(1);
    const bar = new progress('-> Processing [:bar] :percent :etas', {
      total: itemsToProcess.length,
      width: 30,
    });

    execute('npx prisma db push && npx prisma db pull', () => {
      bar.tick(1);
      execute('npx prisma migrate deploy', () => {
        bar.tick(1);
        execute('npx prisma format --schema=prisma/schema-dev.prisma', () => {
          bar.tick(1);
          execute('npx prisma db push', () => {
            bar.tick(1);
            fs.writeFileSync(path, schema_dev, 'utf-8');
            execute(
              `npx prisma migrate dev --create-only --name ${
                migration_name[migration_name.length - 1]
              }`,
              () => {
                bar.tick(1);
                console.log(
                  chalk.green('\nSuccess: Migration made!!'.toUpperCase()),
                );
              },
            );
          });
        });
      });
    });
  }
} else {
  console.log(chalk.red(' -- Migration Up to date --'.toUpperCase()));
}
