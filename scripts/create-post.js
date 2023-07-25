import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';

function run() {
  const filename = 'build';

  if (fs.pathExistsSync(filename)) {
    return;
  }

  fs.createFileSync(`/blog/${filename}.md`);
  fs.writeFileSync(
    `/blog/${filename}.md`,
    `
    ---
      - title: ${filename}
      - description: description
      - date: ${Date.now()}
    ---
    # ${filename}
  `
  );
}

run();
