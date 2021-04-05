import { Configuration, DefinePlugin } from 'webpack';

export function config(entry: string[] = []): string[] {
  return [...entry, require.resolve('./decorator')];
}

export function managerEntries(entry: string[] = []): string[] {
  return [...entry, require.resolve('./register')];
}

declare global {
  const __CREEVEY_SERVER_PORT__: number;
  const __CREEVEY_CLIENT_PORT__: number | null;
}
export interface CreeveyAddonOptions {
  creeveyPort?: number;
  clientPort?: number;
}
export function managerWebpack(config: Configuration, options: CreeveyAddonOptions): Configuration {
  config.plugins?.push(
    new DefinePlugin({
      __CREEVEY_SERVER_PORT__: options.creeveyPort ?? 3000,
      __CREEVEY_CLIENT_PORT__: options.clientPort,
    }),
  );
  return config;
}

// TODO Execute build nodejs webpack bundle
// TODO It depends on watch. How to know it?
// TODO Or execute it in managerWebpack function
// TODO Additional check to do not run in recursion
// TODO quite option, don't proceed any output
// TODO Save bundle as main.cjs or something
// TODO What else?
