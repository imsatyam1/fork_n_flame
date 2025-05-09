import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        inputRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    if (verificationCode.length < 6) return;

    try {
      setLoading(true);
      // await VerifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="p-8 bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col gap-8 animate-fade-in border border-gray-100">
        <div className="text-center">
          <h1 className="font-bold text-2xl md:text-3xl text-gray-800 mb-1">Verify Your Email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email address
          </p>
        </div>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex justify-between gap-2 md:gap-4">
            {otp.map((letter: string, idx: number) => (
              <Input
                key={idx}
                ref={(element) => {
                  inputRef.current[idx] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={letter}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-150"
                aria-label={`OTP Digit ${idx + 1}`}
              />
            ))}
          </div>

          <div className="mt-2">
            {loading ? (
              <Button
                disabled
                className="w-full bg-orange-400 hover:bg-orange-500 text-white transition-colors"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 font-semibold"
              >
                Verify
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
