import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rounded?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  rows?: never;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  type?: never;
  rows?: number;
}

type InputComponentProps = InputProps | TextareaProps;

export const Input = ({
  icon,
  label,
  error,
  rounded = false,
  className = "",
  rows,
  ...props
}: InputComponentProps) => {
  const isTextarea = rows !== undefined;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#7FC242] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && !isTextarea && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {isTextarea ? (
          <textarea
            className={`w-full px-4 py-3 border ${
              error ? "border-red-500" : "border-[#E0E0E0]"
            } focus:border-[#7FC242] focus:ring-2 focus:ring-[#7FC242]/50 rounded-lg transition-all duration-200 ${className}`}
            rows={rows || 10}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={`w-full px-4 py-3 border ${
              error ? "border-red-500" : "border-[#E0E0E0]"
            } focus:border-[#7FC242] focus:ring-2 focus:ring-[#7FC242]/50 transition-all duration-200 ${
              rounded ? "rounded-full" : "rounded-lg"
            } ${icon ? "pl-10" : ""} ${className}`}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
