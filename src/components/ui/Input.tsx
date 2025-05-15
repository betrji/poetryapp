import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Input({ label, id, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        className="modern-input peer"
        placeholder=" "
      />
      <label htmlFor={id} className="modern-label">
        {label}
      </label>
    </div>
  );
}

export function TextArea({ label, id, ...props }: TextAreaProps) {
  return (
    <div className="relative">
      <textarea
        id={id}
        {...props}
        className="modern-input peer min-h-[300px] resize-none"
        placeholder=" "
      />
      <label htmlFor={id} className="modern-label">
        {label}
      </label>
    </div>
  );
}