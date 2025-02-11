import cluster from 'cluster';
import minimist from 'minimist';
import chalk from 'chalk';
import creevey from './server';
import { Options } from './types';
import { emitWorkerMessage } from './server/messages';
import { isShuttingDown, shutdownWorkers } from './server/utils';

function shutdown(reason: unknown): void {
  if (isShuttingDown.current) return;

  const error = reason instanceof Error ? reason.stack ?? reason.message : (reason as string);

  console.log(chalk`[{red FAIL}{grey :${process.pid}}]`, error);

  process.exitCode = -1;
  if (cluster.isWorker) emitWorkerMessage({ type: 'error', payload: { error } });
  if (cluster.isMaster && !isShuttingDown.current) void shutdownWorkers();
}

process.on('uncaughtException', shutdown);
process.on('unhandledRejection', shutdown);

const argv = minimist<Options>(process.argv.slice(2), {
  string: ['browser', 'config', 'reporter', 'reportDir', 'screenDir'],
  boolean: ['debug', 'ui', 'saveReport', 'webpack', 'tests'],
  default: { port: 3000, saveReport: true },
  alias: { port: 'p', config: 'c', debug: 'd', update: 'u', extract: 'e' },
});

// @ts-expect-error: define log level for storybook
global.LOGLEVEL = argv.debug ? 'debug' : 'warn';

void creevey(argv);
