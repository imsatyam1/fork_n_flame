import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const loading = false;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-gray-800">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your new password below
          </p>
        </div>

        <div className="relative">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="pl-10"
          />
          <LockKeyholeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="w-full">
          {loading ? (
            <Button
              type="submit"
              disabled
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Reset Password
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Back to{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
