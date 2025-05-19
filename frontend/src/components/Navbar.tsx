import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";

const navLinkStyle =
  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium";

const Navbar = () => {
  const { user, loading, logout } = useUserStore();
  const [cart, setCart] = useState<string[]>(["Pizza"]);
  const [theme, setTheme] = useState("light");

  return (
    <div className="w-full px-4 py-5 shadow-md bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between max-w-full mx-[5%]">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold">
          Fork <span className="text-orange-500">&</span> Flame
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-6">
            <Link
              to="/order/status"
              className="hover:text-orange-500 hover:text-lg hover:font-bold hover:underline"
            >
              Order
            </Link>

            {user?.admin && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Dashboard</MenubarTrigger>
                  <MenubarContent>
                    <Link to="/admin/restaurant">
                      <MenubarItem>Restaurant</MenubarItem>
                    </Link>
                    <Link to="/admin/menu">
                      <MenubarItem>Menu</MenubarItem>
                    </Link>
                    <Link to="/admin/orders">
                      <MenubarItem>Orders</MenubarItem>
                    </Link>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </nav>

          {/* Theme, Cart, Avatar, Auth Buttons */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Avatar */}
            {user && (
              <Link to="/profile">
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="profile" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            )}

            {/* Login / Logout */}
            {user ? (
              loading ? (
                <Button className="bg-orange-500 text-white gap-5" disabled>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait
                </Button>
              ) : (
                <Button onClick={logout} className="bg-orange-500 text-white hover:bg-orange-600 gap-5">
                  Logout
                </Button>
              )
            ) : (
              <Link to="/login">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">Login</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileNavbar
            user={user}
            loading={loading}
            logout={logout}
            cartCount={cart.length}
            setTheme={setTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, loading, logout, cartCount, setTheme }: any) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row justify-between items-center mt-2">
          <SheetTitle className="text-xl font-bold">Fork & Flame</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-5 w-5 dark:hidden" />
                <Moon className="h-5 w-5 hidden dark:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>

        <Separator className="my-5" />

        <SheetDescription className="flex-1 flex flex-col gap-2">
          {user && (
            <Link to="/profile" className={navLinkStyle}>
              <User /> Profile
            </Link>
          )}
          <Link to="/order/status" className={navLinkStyle}>
            <HandPlatter /> Order
          </Link>
          <Link to="/cart" className={navLinkStyle}>
            <ShoppingCart /> Cart ({cartCount})
          </Link>

          {user?.admin && (
            <>
              <Link to="/admin/menu" className={navLinkStyle}>
                <SquareMenu /> Menu
              </Link>
              <Link to="/admin/restaurant" className={navLinkStyle}>
                <UtensilsCrossed /> Restaurant
              </Link>
              <Link to="/admin/orders" className={navLinkStyle}>
                <PackageCheck />
                Restaurant Orders
              </Link>
            </>
          )}
        </SheetDescription>

        <SheetFooter className="flex flex-col gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="font-semibold">Fork & Flame</p>
            </div>
          )}

          <SheetClose asChild>
            {user ? (
              loading ? (
                <Button className="bg-orange-500 text-white" disabled>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Please wait
                </Button>
              ) : (
                <Button
                  onClick={logout}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Logout
                </Button>
              )
            ) : (
              <Link to="/login">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  Login
                </Button>
              </Link>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
