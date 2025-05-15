import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glassmorphic-card p-10 fade-in-delay-1 ${className}`}>
      {children}
    </div>
  );
}

export default Card;