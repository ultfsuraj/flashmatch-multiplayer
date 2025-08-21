'use client';

import { cn } from ' @/utils/cn';

const Button = ({
  text,
  className = '',
  onClick = () => {},
  type = 'button',
}: {
  text: string;
  className?: string;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
}) => {
  return (
    <button
      type={type}
      className={cn('font-montserrat rounded-md bg-black px-2 py-1 font-semibold text-white', className)}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {text}
    </button>
  );
};

export default Button;
