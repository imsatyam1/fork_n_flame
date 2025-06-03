import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const { loading, login } = useUserStore();

  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }
    try {
      await login(input);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={loginSubmitHandler}
        className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
      >
        <div className="text-center">
          <h1
            className="text-3xl font-extrabold text-gray-800"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Fork <span className="text-orange-500">&</span> Flame
          </h1>
          <p className="text-sm text-gray-500">Welcome back! Please login.</p>
        </div>

        {/* Email Field */}
        <div className="relative">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={changeEventHandler}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-1.5 text-gray-400" />
          {errors.email && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={changeEventHandler}
            className="pl-10"
          />
          <LockKeyhole className="absolute left-3 top-1.5 text-gray-400" />
          {errors.password && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.password}
            </span>
          )}
        </div>

        {/* Login Button */}
        <div className="pt-2">
          {/* {loading ? (
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
              className="w-full bg-orange-400 hover:bg-orange-500 text-white transition-all duration-300"
            >
              Login
            </Button>
          )} */}
          <Button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white transition-all duration-300"
            >
              Login
            </Button>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Separator className="my-4" />

        {/* Signup Link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?
          <Link
            to="/signup"
            className="ml-1 font-medium text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
