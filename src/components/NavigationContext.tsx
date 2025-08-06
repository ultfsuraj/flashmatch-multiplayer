'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, createContext, useContext, useTransition } from 'react';

export const DELAY = 1000;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
const noop = () => {};

type NavigationContext = {
  pending: boolean;
  navigate: (url: string) => void;
};

const Context = createContext<NavigationContext>({
  pending: false,
  navigate: noop,
});

export const useNavigationContext = () => useContext(Context);

const NavigationContext = ({ children }: { children: ReactNode }) => {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const navigate = (href: string) => {
    startTransition(async () => {
      await Promise.all([router.push(href), sleep(DELAY)]);
    });
  };

  return <Context.Provider value={{ pending, navigate }}>{children}</Context.Provider>;
};

export default NavigationContext;
