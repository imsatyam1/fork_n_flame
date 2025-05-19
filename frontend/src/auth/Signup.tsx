import React, { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@radix-ui/react-separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    email: "",
    contact: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<SignupInputState>>({});

  const navigate = useNavigate();

  const {loading, signup} = useUserStore();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const signUpSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userSignupSchema.safeParse(input);
    if(!result.success){
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }
    try {
      const success = await signup(input);
      if (success) {
        navigate("/verify-email")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={signUpSubmitHandler}
        className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Fork <span className="text-orange-500">&</span> Flame
          </h1>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        {/* Full Name */}
        <div className="relative">
          <Input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={input.fullname}
            onChange={changeEventHandler}
            className="pl-10"
          />
          <User className="absolute left-3 top-1.5 text-gray-400" />
          {errors.fullname && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.fullname}
            </span>
          )}
        </div>

        {/* Email */}
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

        {/* Contact */}
        <div className="relative">
          <Input
            type="number"
            name="contact"
            placeholder="Contact Number"
            value={input.contact}
            onChange={changeEventHandler}
            className="pl-10"
          />
          <Phone className="absolute left-3 top-1.5 text-gray-400" />
          {errors.contact && (
            <span className="mt-1 block text-xs text-red-500">
              {errors.contact}
            </span>
          )}
        </div>

        {/* Password */}
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

        {/* Submit Button */}
        <div>
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
              className="w-full bg-orange-400 hover:bg-orange-500 text-white transition-all duration-300"
            >
              Sign Up
            </Button>
          )}
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1 bg-gray-200 h-px" />
          <span className="text-sm text-gray-400">or</span>
          <Separator className="flex-1 bg-gray-200 h-px" />
        </div>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-medium text-blue-500 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
