"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatPrice, whatsappLink } from "@/lib/types";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  whatsappPhone: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "md_cart";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

export default function CartProvider({
  children,
  whatsappPhone,
}: {
  children: React.ReactNode;
  whatsappPhone: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, whatsappPhone, addItem, updateQuantity, removeItem, clear, total, count }}>
      {children}
      <CartWidget />
    </CartContext.Provider>
  );
}

function CartWidget() {
  const { items, whatsappPhone, updateQuantity, removeItem, clear, total, count } = useCart();
  const [open, setOpen] = useState(false);

  function handleSendOrder() {
    const lines = [
      "Hola! Quiero hacer un pedido de Multidistribuidora:",
      "",
      ...items.map((i) => `- ${i.quantity}x ${i.name} — ${formatPrice(i.price * i.quantity)}`),
      "",
      `Total: ${formatPrice(total)}`,
    ];
    window.open(whatsappLink(whatsappPhone, lines.join("\n")), "_blank", "noopener,noreferrer");
    clear();
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver carrito"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-ink">Tu carrito</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-ink-soft hover:text-ink text-xl leading-none"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-ink-soft">Todavía no agregaste productos.</p>
            ) : (
              <>
                <div className="flex flex-col gap-4 mb-6 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-brand-50 overflow-hidden flex items-center justify-center text-brand-300">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">🧴</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                        <p className="text-xs text-ink-soft">{formatPrice(item.price)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 rounded-full border border-brand-200 text-ink-soft hover:bg-brand-50 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 rounded-full border border-brand-200 text-ink-soft hover:bg-brand-50 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label="Quitar"
                        className="text-ink-soft hover:text-red-500 text-lg leading-none ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-5 pt-4 border-t border-brand-100">
                  <span className="text-sm font-medium text-ink-soft">Total</span>
                  <span className="font-display text-lg font-bold text-brand-700">{formatPrice(total)}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSendOrder}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
                  >
                    Enviar pedido por WhatsApp
                  </button>
                  <button
                    onClick={clear}
                    className="text-xs text-ink-soft hover:text-red-500 py-1"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
