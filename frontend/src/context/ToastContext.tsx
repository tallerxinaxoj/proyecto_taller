import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: number; kind: 'success' | 'error' | 'info'; text: string };
type Ctx = { show: (text: string, kind?: Toast['kind']) => void };

const C = createContext<Ctx>({ show: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const show = useCallback((text: string, kind: Toast['kind'] = 'info') => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, kind, text }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  return (
    <C.Provider value={{ show }}>
      {children}
      <div className="fixed right-4 bottom-4 grid gap-2 z-50">
        {items.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded shadow text-sm ${
              t.kind === 'success' ? 'bg-green-700 text-green-100' : t.kind === 'error' ? 'bg-red-700 text-red-100' : 'bg-gray-700 text-gray-100'
            }`}>{t.text}</div>
        ))}
      </div>
    </C.Provider>
  );
}

export const useToast = () => useContext(C);

