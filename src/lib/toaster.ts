export type Toast = { id: number; type: 'error' | 'info' | 'success'; message: string };

let listeners: ((t: Toast) => void)[] = [];
let nextId = 1;

export const toaster = {
  subscribe(fn: (t: Toast) => void) {
    listeners.push(fn);

    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
  push(type: Toast['type'], message: string) {
    const t: Toast = { id: nextId++, type, message };

    listeners.forEach((l) => l(t));

    return t;
  },
  error(message: string) {
    return this.push('error', message);
  },
  info(message: string) {
    return this.push('info', message);
  },
  success(message: string) {
    return this.push('success', message);
  },
};
