import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { motion } from "motion/react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  error,
}: OtpInputProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const getFirstEmptyIndex = () => {
    const index = digits.findIndex((digit) => !digit);
    return index === -1 ? length - 1 : index;
  };

  const handleFocus = (
    index: number,
    e: FocusEvent<HTMLInputElement>
  ) => {
    const firstEmptyIndex = getFirstEmptyIndex();

    if (index !== firstEmptyIndex) {
      e.target.blur();
      focusInput(firstEmptyIndex);
    }
  };

  const handleChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const firstEmptyIndex = getFirstEmptyIndex();

    if (index !== firstEmptyIndex && digits[index] === "") {
      focusInput(firstEmptyIndex);
      return;
    }

    const digit = e.target.value.replace(/\D/g, "").slice(-1);

    if (!digit) return;

    const nextDigits = [...digits];
    nextDigits[index] = digit;

    onChange(nextDigits.join(""));

    if (index < length - 1) {
      setTimeout(() => focusInput(index + 1), 0);
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();

    const nextDigits = [...digits];

    // Delete current digit
    if (digits[index]) {
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
      return;
    }

    // Move backward and delete previous digit
    if (index > 0) {
      nextDigits[index - 1] = "";
      onChange(nextDigits.join(""));
      setTimeout(() => focusInput(index - 1), 0);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);

    const nextFocus =
      pasted.length >= length ? length - 1 : pasted.length;

    setTimeout(() => focusInput(nextFocus), 0);
  };

  return (
    <div className="w-full">
      <div className="flex w-full justify-center gap-1.5 sm:gap-2">
        {digits.map((digit, index) => {
          const firstEmptyIndex = getFirstEmptyIndex();

          return (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onFocus={(e) => handleFocus(index, e)}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              whileFocus={{
                boxShadow: "0 0 0 3px rgba(232,104,47,0.15)",
                borderColor: "#E8682F",
              }}
              transition={{ duration: 0.15 }}
              style={{ transform: "translateZ(0)" }}
              readOnly={
                index > firstEmptyIndex &&
                !digits[index]
              }
              className={`h-12 w-10 sm:h-14 sm:w-12 rounded-lg border bg-white text-center text-lg sm:text-xl font-semibold text-[#14151A] outline-none ${
                error ? "border-red-400" : "border-[#E5E2DA]"
              }`}
            />
          );
        })}
      </div>

      <p
        className={`mt-2 min-h-4 text-center text-xs ${
          error ? "text-red-500" : "text-transparent"
        }`}
      >
        {error || "."}
      </p>
    </div>
  );
};