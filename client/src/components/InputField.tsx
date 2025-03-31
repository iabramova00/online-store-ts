import React from "react";

interface InputFieldProps {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    required = false,
    placeholder,
}) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-3 text-base sm:text-lg rounded-lg border border-gray-300 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
        </div>
    );
};

export default InputField;
