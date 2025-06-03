import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { Loader2, Plus } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const defaultMenuInput: MenuFormSchema = {
  theme: "",
  name: "",
  description: "",
  price: 0,
  image: undefined,
};
const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>(defaultMenuInput);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectMenu, setSelectMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const { restaurant } = useRestaurantStore();
  const { getRestaurant } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: name === "price" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("theme", input.theme);
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }

      const success = await createMenu(formData);
      if (success) {
        setOpen(false);
        setInput(defaultMenuInput);
        setError({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!open) {
      getRestaurant(); 
    }
  }, [open]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Available Menus</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-lg">
              <Plus className="mr-2" /> Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add a New Menu
              </DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <Label className="block mb-1">Theme & Vibes</Label>
                <Input
                  type="text"
                  name="theme"
                  value={input.theme}
                  onChange={changeEventHandler}
                  placeholder="Enter menu theme"
                />
                {error.name && (
                  <span className="text-xs text-red-600 font-medium">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label className="block mb-1">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter menu name"
                />
                {error.name && (
                  <span className="text-xs text-red-600 font-medium">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label className="block mb-1">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter menu description"
                />
                {error.description && (
                  <span className="text-xs text-red-600 font-medium">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <Label className="block mb-1">Price in Rupees</Label>
                <Input
                  type="text"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu price"
                />
                {error.price && (
                  <span className="text-xs text-red-600 font-medium">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label className="block mb-1">Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error.image?.name && (
                  <span className="text-xs text-red-600 font-medium">
                    {error.image?.name}
                  </span>
                )}
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button
                    disabled
                    className="bg-orange-400 hover:bg-orange-300 text-white"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange-500 hover:bg-orange-400 text-white">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-6">
        {restaurant?.menus.map((menu: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-start md:items-center bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4 gap-4"
          >
            <img
              src={menu.image}
              alt="Menu Item"
              className="w-full md:w-32 h-32 object-cover rounded-md"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {menu.name}
              </h2>
              <h3 className="text-md text-gray-900">
                ({menu.theme})
              </h3>
              <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
              <div className="text-md font-bold mt-2 text-gray-700">
                Price: <span className="text-orange-500">₹{menu.price}</span>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectMenu(menu);
                setEditOpen(true);
              }}
              size="sm"
              className="bg-orange-500 hover:bg-orange-400 text-white mt-4 md:mt-0"
            >
              Edit
            </Button>
          </div>
        ))}
        {selectMenu && 
        <EditMenu
          selectedMenu={selectMenu}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
        />}
      </div>
    </div>
  );
};

export default AddMenu;
