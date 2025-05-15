import { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  href?: string;
}

function Button({ children, variant = 'primary', href, ...props }: ButtonProps) {
  const baseStyles = "modern-action-btn";
  const variants = {
    primary: "bg-pink-500 text-white border-pink-500 hover:bg-pink-600",
    secondary: "bg-white text-pink-500 border-pink-200 hover:bg-pink-50"
  };

  const className = `${baseStyles} ${variants[variant]} ${props.className || ''}`;

  if (href) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}

export default Button;