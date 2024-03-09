"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";
import Students from "./Students";
import Assigned from "./Assigned";
import { useRouter } from "next/navigation";

interface UserData{
  _id: string;
  name: string;
  displayPic?: string;
  education?: string[];
  skills?: string[];
  bio?: string;
  experience?: string[];
  linkedIn?: string;
  email: string;
  phone: string;
  students?: any[];
  password: string;
}
export default function MentorPage() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("data");
    router.push(`/`);
    console.log("Logout");
  };

  const [userData,setUserData]=useState<UserData|null>(null);
  useEffect(()=>{
    const data=localStorage.getItem("data");
    if(data){
      setUserData(JSON.parse(data));
    }
  },[]);
  const [sidePanel, setSidePanel] = useState(0);
  return (
    <div className="flex bg-prim flex-col ">
      <div className="p-2 flex justify-between items-center mt-2.5">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-transparent hover:bg-sec hover:text-prim">
              <RxHamburgerMenu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetTitle>Menu</SheetTitle>
            <div className="flex flex-col gap-6 w-[80%] mt-10 ">
              <SheetClose asChild>
                <Button
                  className="bg-prim"
                  onClick={() => {
                    setSidePanel(0);
                  }}
                >
                  All Students
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  className="bg-prim"
                  disabled={(userData?.students?.length ?? 0) < 3 || (userData?.students?.length ?? 0) > 4}
                  onClick={() => {
                    setSidePanel(1);
                  }}
                >
                  Assigned Students
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden sm:flex gap-6">
          <Button variant="outline" >
            Profile
          </Button>
          <Button
            variant="outline"
            
            onClick={handleLogout}
          >
            Logout
          </Button>

          <Avatar>
                  <AvatarImage src={userData?.displayPic} />
                  <AvatarFallback>{userData?.name[0]}</AvatarFallback>
                </Avatar>
          
        </div>
        <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={userData?.displayPic} />
                  <AvatarFallback>{userData?.name[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button variant="outline">Profile</Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>
      <div className="w-full h-screen ">
        {sidePanel == 0 && <Students />}
        {sidePanel == 1 && <Assigned />}
      </div>
    </div>
  );
}
