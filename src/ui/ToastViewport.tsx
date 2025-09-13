import { type Toast as T, toaster } from '@lib/toaster';
import * as Toast from '@radix-ui/react-toast';
import * as React from 'react';

export function ToastViewport() {
  const [items, setItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    return toaster.subscribe((t) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 5000);
    });
  }, []);

  const COLOR: Record<T['type'], string> = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-blue-600',
  } as const;

  const color = (t: T) => COLOR[t.type];

  return (
    <Toast.Provider swipeDirection="right">
      {items.map((t) => (
        <Toast.Root
          key={t.id}
          className={`data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out-slide-to-right ${color(t)} text-white rounded-md shadow-md px-3 py-2 mb-2`}
        >
          <Toast.Description>{t.message}</Toast.Description>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed top-4 right-4 z-[1000] flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
