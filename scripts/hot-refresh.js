import chokidar from 'chokidar';
import { exec } from 'child_process';

let devProcess = exec('pnpm dev');

chokidar.watch('posts').on('all', (event, path) => {
  console.log(`[posts] ${event}: ${path}，重启 dev server...`);
  devProcess.kill();
  devProcess = exec('pnpm dev');
});
