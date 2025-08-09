
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-4 px-6 mt-auto">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Desenvolvido por{' '}
          <a
            href="https://newdester.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Newdester
          </a>
        </p>
      </div>
    </footer>
  );
};
