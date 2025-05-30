import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import {
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinnedIcon,
  Plus,
} from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

type profileDataState = {
  fullname: string;
  email: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
};
const Profile = () => {
  const { user, updateProfile } = useUserStore(); 
  const [loading, setLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<profileDataState>({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    profileData.profilePicture || ""
  );

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updatePeofileHandler = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    try {
      setLoading(true)
      await updateProfile(profileData)
    } catch (error: any) {
      console.log(error);
      toast.error(error)
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <form
      onSubmit={updatePeofileHandler}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8 flex-grow"
    >
      {/* Profile Avatar & Name */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="md:w-28 md:h-28 w-20 h-20 border-2 border-orange-400 shadow-md">
            <AvatarImage src={selectedProfilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Input
            ref={imageRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={fileChangeHandler}
          />
          <div
            onClick={() => imageRef.current?.click()}
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer rounded-full"
          >
            <Plus className="text-white w-6 h-6" />
          </div>
        </div>
        <Input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={profileData.fullname}
          onChange={changeHandler}
          className="text-2xl font-semibold border-none outline-none focus-visible:ring-0 bg-transparent"
        />
      </div>

      {/* Email Field */}
      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-md shadow-sm">
        <Mail className="text-gray-500 w-5 h-5" />
        <div className="w-full">
          <Label className="text-sm text-gray-600">Email</Label>
          <Input
            disabled
            name="email"
            value={profileData.email}
            onChange={changeHandler}
            className="w-full text-gray-600 bg-transparent border-none focus:ring-0 outline-none"
          />
        </div>
      </div>

      {/* Address, City, Country Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <LocateIcon className="text-gray-500 w-5 h-5 mt-1" />
          <div className="w-full">
            <Label className="text-sm text-gray-600">Address</Label>
            <Input
              name="address"
              value={profileData.address}
              onChange={changeHandler}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <MapPin className="text-gray-500 w-5 h-5 mt-1" />
          <div className="w-full">
            <Label className="text-sm text-gray-600">City</Label>
            <Input
              name="city"
              value={profileData.city}
              onChange={changeHandler}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <MapPinnedIcon className="text-gray-500 w-5 h-5 mt-1" />
          <div className="w-full">
            <Label className="text-sm text-gray-600">Country</Label>
            <Input
              name="country"
              value={profileData.country}
              onChange={changeHandler}
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        {loading ? (
          <Button
            disabled
            className="bg-orange-400 text-white hover:bg-orange-500"
          >
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Updating...
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-orange-400 text-white hover:bg-orange-500"
          >
            Update Profile
          </Button>
        )}
      </div>
    </form>
    <Footer />
    </div>
  );
};

export default Profile;
