import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { consoleLog } from '@/lib/console';

/**
 * 获取音乐文件列表的API路由
 */
export async function GET() {
  try {
    const musicDir = join(process.cwd(), 'public', 'music');
    const files = await readdir(musicDir);

    // 过滤音频文件
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const audioFiles = files.filter(file =>
      audioExtensions.some(ext => file.toLowerCase().endsWith(ext)),
    );

    // 构建音乐曲目数据
    const tracks = audioFiles.map((file, index) => {
      // 从文件名提取标题（去掉扩展名）
      const title = file.replace(/\.[^/.]+$/, '');

      return {
        id: (index + 1).toString(),
        title,
        artist: '未知艺术家',
        src: `/music/${encodeURIComponent(file)}`,
      };
    });

    return NextResponse.json({ tracks });
  }
  catch (error) {
    consoleLog('ERROR', 'Error reading music directory:', error);
    return NextResponse.json(
      { error: 'Failed to load music files' },
      { status: 500 },
    );
  }
}
