'use client';

import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useNavigationContext } from ' @/components/NavigationContext';
import { usePathname } from 'next/navigation';

type LinkProps = ComponentProps<typeof NextLink>;

const Link = (props: LinkProps) => {
  const routePath = usePathname();
  const { navigate } = useNavigationContext();
  return (
    <NextLink
      {...props}
      onClick={(e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        href?.trim();
        if (href === routePath) return;
        if (href) navigate(href);
      }}
    />
  );
};

export default Link;
