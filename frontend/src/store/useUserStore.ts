import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:8080/api/v1/user";
axios.defaults.withCredentials = true;

type User = {
  _id: string;
  fullname: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<boolean>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verficationCode: string) => Promise<boolean>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  updateProfile: (input: any) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,

      // signup api implementation
      signup: async (input: SignupInputState): Promise<boolean> => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: { "Content-Type": "application/json" },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Signup failed");
          set({ loading: false });
          return false;
        }
      },

      login: async (input: LoginInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      verifyEmail: async (verificationCode: string): Promise<boolean> => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Verification failed");
          set({ loading: false });
          return false;
        }
      },

      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const response = await axios.get(`${API_END_POINT}/check-auth`);
          
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          }
        } catch (error) {
          set({ isAuthenticated: false, isCheckingAuth: false });
        }
      },

      logout: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/logout`);

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, user: null, isAuthenticated: false });
            return true;
          } else {
            return false;
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          return false;
        }
        finally{
          set({ loading: false });
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, user: null, isAuthenticated: false });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.reponse.data.message);
          set({ loading: false });
          return false;
        }
      },
      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
            return true;
          } else {
            set({ loading: false });
            return false;
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
          return false;
        }
      },

      updateProfile: async (formData: FormData) => {
        try {
          const userId = get().user?._id;
          if (!userId) {
            toast.error("User ID is missing");
            return;
          }

          formData.append("_id", userId);

          const response = await axios.put(
            `${API_END_POINT}/update-profile`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Profile update failed");
        }
      },

      resendEmailVerification: async () => {
        try {
          const userId = get().user?._id;
          if (!userId) {
            toast.error("User ID is missing");
            return;
          }
          const response = await axios.post(`${API_END_POINT}/resend-otp`, {
            _id: userId,
          });

          if (response.data.success) {
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
