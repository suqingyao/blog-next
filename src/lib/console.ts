// 定义日志标签的颜色
enum LOG_COLORS {
  INFO = '\x1b[2m\x1b[30m\x1b[42m', // 绿色
  WARN = '\x1b[1m\x1b[30m\x1b[43m', // 黄色
  ERROR = '\x1b[1m\x1b[30m\x1b[41m', // 红色
  DEBUG = '\x1b[1m\x1b[30m\x1b[46m', // 品红色
  RESET = '\x1b[0m', // 重置颜色
  TIME = '\x1b[1m\x1b[30m\x1b[44m' // 蓝色
}

// 定义日志标签
enum LOG_TAGS {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// 定义日志函数
const log = (tag: keyof typeof LOG_TAGS, message: string, ...args: any[]) => {
  const tagName = LOG_TAGS[tag] || LOG_TAGS.INFO;
  console.log(
    `${LOG_COLORS.TIME} ${new Date().toLocaleString()} ${LOG_COLORS.RESET} ${LOG_COLORS[tag]} ${tagName} ${LOG_COLORS.RESET} ${message}`,
    ...args
  );
};

// 导出日志函数
export { log as consoleLog };
