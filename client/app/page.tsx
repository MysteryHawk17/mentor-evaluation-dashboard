"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";
interface Mentor {
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

// const mentors: Mentor[] = mentorsData as Mentor[];

const LandingPage: React.FC = () => {
  const [mentors, setMentors] = React.useState<Mentor[]>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mentor/getallmentors`)
      .then((res) => {
        setMentors(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);
  const router = useRouter();
  const handleRedirect = (id: string) => {
    const selectedMentor=mentors.find((mentor)=>mentor._id===id);
    localStorage.setItem("data",JSON.stringify(selectedMentor));
    router.push(`/${id}`);
    console.log(`Redirecting to ${id}'s page...`);
  };

  return (
    <div className="bg-prim min-h-screen flex justify-center items-center">
      <div className="bg-sec sm:p-10 p-7 rounded-lg shadow-md flex flex-col min-h-[22rem] w-[90%] sm:w-[60%] md:max-w-[50%]">
        <h1 className="sm:text-3xl text-2xl font-light text-font-color-primary text-center sm:mb-12 mb-[37px] mt-14">
          Select your profile
        </h1>
        <div
          className="flex flex-col gap-6 sm:max-h-[180px]  max-h-[120px] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {mentors.map((user) => (
            <Button
              className="bg-fontPrim "
              key={user.email}
              onClick={() => handleRedirect(user._id)}
            >
              {user.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
