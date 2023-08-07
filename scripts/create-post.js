import fg from 'fast-glob';
import fs from 'fs-extra';
import { join } from 'path';

function run() {
  const filename = 'build';

  if (fs.pathExistsSync(filename)) {
    return;
  }

  fs.createFileSync(`/posts/${filename}.mdx`);
  fs.writeFileSync(
    `/posts/${filename}.mdx`,
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
