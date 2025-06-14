import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rounded?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  type?: "text" | "email" | "tel" | "password" | "number" | "date" | "time";
  rows?: never;
}

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseProps {
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
  type = "text",
  ...props
}: InputComponentProps) => {
  const isTextarea = rows !== undefined;

  // Custom styles for date and time inputs
  const getInputStyles = () => {
    const baseStyles = `w-full px-4 py-3 border-2 ${
      error ? "border-red-500" : "border-[#E0E0E0]"
    } focus:border-[#7FC242] focus:ring-0 focus:outline-none focus:border-2 transition-all duration-200 ${
      rounded ? "rounded-full" : "rounded-lg"
    } ${icon ? "pl-10" : ""}`;

    // Special styles for date and time inputs
    if (type === "date" || type === "time") {
      return `${baseStyles} [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80 [&::-webkit-calendar-picker-indicator]:transition-opacity`;
    }

    return baseStyles;
  };

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
            className={`w-full px-4 py-3 border-2 ${
              error ? "border-red-500" : "border-[#E0E0E0]"
            } focus:border-[#7FC242] focus:ring-0 focus:outline-none focus:border-2 rounded-lg transition-all duration-200 ${className}`}
            rows={rows || 10}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            className={`${getInputStyles()} ${className}`}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
