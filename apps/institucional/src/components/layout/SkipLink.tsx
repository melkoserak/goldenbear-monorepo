import React from 'react';

export const SkipLink = () => {
  return (
    <a
      href="#content"
      className="absolute top-4 left-4 z-[100] -translate-y-[150%] bg-primary text-primary-foreground px-4 py-2 rounded-md transition-transform focus:translate-y-0 font-bold"
    >
      Pular para o conteúdo principal
    </a>
  );
};