#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import cac from 'cac';
import chalk from 'chalk';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import ora from 'ora';

const cli = cac();

cli.command('<filename> [title]').action(async (filename, title) => {
  const filePath = path.join(
    process.cwd(),
    'posts',
    `${dayjs().format('YYYYMMDD')}_${filename}.mdx`,
  );

  if (await fs.pathExists(filePath)) {
    console.error(chalk.red('Error: File already exists.'));
    process.exit(1);
  }

  const template = `
---
  id: ${`${dayjs().format('YYYYMMDD')}_${filename}`}
  title: ${title || filename}
  createdTime: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}
  published: false
---
    `;
  try {
    const spinner = ora('🚀🚀🚀 start create...').start();
    await fs.writeFile(filePath, template, 'utf-8');
    spinner.succeed(
      chalk.green(`🎉🎉🎉 File [${filename}] created successfully.`),
    );
  }
  catch {}
});

cli.parse();
