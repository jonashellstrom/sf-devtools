declare global {
  interface Window {
    api: {
      receive: (channel: string, func: (data: any) => void) => Promise<void>;
      send: (channel: string, data: string) => Promise<void>;
      sendApex: (channel: string, apex: string) => Promise<string>;
    };
  }
}

export {};
