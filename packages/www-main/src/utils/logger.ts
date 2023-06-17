import chalk from 'chalk'

enum LoggerLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

function renderTime() {
  const now = new Date()
  return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`
}

function renderScope(scope: string) {
  return chalk.green.underline(scope)
}

function renderMessage(color: chalk.Chalk, messages: any[]) {
  return messages.map(m => (typeof m === 'string' ? color(m) : m))
}

function renderLog(method: LoggerLevel,
  level: string,
  color: chalk.Chalk,
  scope?: string) {
  return (...messages: any) => {
    const logs: any[] = []
    logs.push(chalk.greenBright('[NP]'))
    logs.push(renderTime())
    logs.push(level)
    if (scope)
      logs.push(renderScope(scope))

    return console[method](...logs, ...renderMessage(color, messages))
  }
}

function createLogger(scope?: string) {
  return {
    debug: renderLog(
      LoggerLevel.Debug,
      chalk.cyan('[DEBUG]'),
      chalk.cyanBright,
      scope,
    ),
    info: renderLog(
      LoggerLevel.Info,
      chalk.blue('[_INFO]'),
      chalk.greenBright,
      scope,
    ),
    warn: renderLog(
      LoggerLevel.Warn,
      chalk.yellow('[_WARN]'),
      chalk.yellowBright,
      scope,
    ),
    error: renderLog(
      LoggerLevel.Error,
      chalk.red('[ERROR]'),
      chalk.redBright,
      scope,
    ),
  }
}

export default {
  ...createLogger(),
  scope: createLogger,
}
