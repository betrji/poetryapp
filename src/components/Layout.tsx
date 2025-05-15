import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {(title || subtitle) && (
        <header className="text-center mb-8 fuji-header fade-in">
          {title && (
            <h1 className="text-5xl font-bold mb-3 japanese-heading font-heading text-pink-800">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 mt-4 font-body">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}

export default Layout;