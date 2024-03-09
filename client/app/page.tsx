"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import "./globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRecoilState } from "recoil";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { mentorState } from "@/lib/state";

const LandingPage: React.FC = () => {
  const [mentors, setMentors] = useRecoilState(mentorState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mentor/getallmentors`)
      .then((res) => {
        setMentors(res.data);
        console.log(res.data);
        setLoading(false);
        toast({
          variant: "default",
          title: "Fetched successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Failed to fetch mentors",
        });
      });
  }, []);
  const router = useRouter();
  const handleRedirect = (id: string) => {
    const selectedMentor = mentors.find((mentor) => mentor._id === id);
    localStorage.setItem("data", JSON.stringify(selectedMentor));
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
          {loading ? (
            <Skeleton className=" sm:max-h-[180px]  max-h-[120px] bg-skelton rounded-full" />
          ) : (
            mentors.map((user) => (
              <Button
                className="bg-fontPrim "
                key={user._id}
                onClick={() => handleRedirect(user._id)}
              >
                {user.name}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
