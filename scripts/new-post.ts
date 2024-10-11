#!/usr/bin/env node

import cac from 'cac';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import dateUtil from '@/utils/dateUtil';

const cli = cac();

cli.command('create <filename> [title]').action(async (filename, title) => {
  const filePath = path.join(process.cwd(), 'posts', filename + '.mdx');

  if (await fs.pathExists(filePath)) {
    console.error(chalk.red('Error: File already exists.'));
    process.exit(1);
  }

  const template = `
---
  id: ${dateUtil().format('YYYY-MM-DD') + '_' + filename}
  title: ${title || filename}
  createdTime: ${dateUtil().format('YYYY-MM-DD HH:mm:ss')}
  published: false
---
    `;
  const spinner = ora('Loading...').start();
  await fs.writeFile(filePath, template, 'utf-8');
  spinner.succeed(chalk.green(`File [${filename}] created successfully.`));
});

cli.parse();
