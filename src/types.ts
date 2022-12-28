declare global {
  interface Window {
    api: {
      selectFolder: (channel: string) => Promise<string>;
      on: <R = string>(
        channel: string,
        sfdxPath: string,
        args?: readonly unknown[]
      ) => Promise<R>;
    };
  }
}

export {};
