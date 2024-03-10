"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, usePathname } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useRecoilState } from "recoil";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Student,
  assignedStudentsState,
  unassignedStudentsState,
  userState,
} from "@/lib/state";

const Dashboard = () => {
  const { toast } = useToast();
  const [assignedStudents, setAssignedStudents] = useRecoilState(
    assignedStudentsState
  );
  const [unassignedStudents, setUnassignedStudents] = useRecoilState(
    unassignedStudentsState
  );
  const { id } = useParams();
  console.log(id);
  const [unassignedLoading, setUnassignedLoading] = useState(false);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const[userData,setUserData]=useRecoilState(userState);
  useEffect(() => {
    setUnassignedLoading(true);
    setAssignedLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/student/getallunassignedstudents`
      )
      .then((res) => {
        setUnassignedStudents(res.data);
        console.log(res.data);
        setUnassignedLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUnassignedLoading(false);
      });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mentor/getstudents/${id}`
      )
      .then((res) => {
        setAssignedStudents(res.data);
        setAssignedLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setAssignedLoading(false);
      });
  }, []);

  const assignStudent = (student: Student) => {
    if (assignedStudents.length < 4) {
      setAssignedStudents([...assignedStudents, student]);
      setUnassignedStudents(
        unassignedStudents.filter((s) => s._id !== student._id)
      );
    } else {
      alert("You cannot assign more than 4 students.");
    }
  };

  const unassignStudent = (student: Student) => {
    setUnassignedStudents([...unassignedStudents, student]);
    setAssignedStudents(assignedStudents.filter((s) => s._id !== student._id));
  };

  const saveData = () => {
    if (assignedStudents.length > 4) {
      alert("You cannot save more than 4 assigned students.");
      return;
    } else if (assignedStudents.length < 3 && assignedStudents.length != 0) {
      alert("You cannot save less than 3 assigned students.");
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mentor/assignstudents/${id}`,
        {
          students: assignedStudents,
        }
      )
      .then((res) => {
        setAssignedStudents(res.data.students);
        console.log(res.data);
        toast({
          title: "Students Assigned",
          description: "Students have been assigned successfully",
          variant: "default",
        });
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Cannot assign student",
          description: err.response.data.message,
          variant: "destructive",
        });
      });
    console.log("Saving data:", assignedStudents);
  };

  return (
    <div className="flex flex-col sm:m-4 sm:p-4 p-3">
      <div className="container p-6 mx-auto bg-sec rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Student Assignments</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-300 rounded-lg min-h-11">
            <h2 className="text-lg font-semibold mb-2">Unassigned Students</h2>
            <ul className="overflow-y-auto max-h-48">
              {unassignedLoading ? (
                <>
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />
                </>
              ) : (
                unassignedStudents.map((student) => (
                  <li
                    key={student._id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{student.name}</span>
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => assignStudent(student)}
                    >
                      Assign
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="p-4 border border-gray-300 rounded-lg min-h-11">
            <h2 className="text-lg font-semibold mb-2">Assigned Students</h2>
            <ul className="overflow-y-auto max-h-48">
              {assignedLoading ? (
                <>
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />{" "}
                  <Skeleton className="w-[50%] h-[30px] rounded-xl mb-4 bg-skelton" />
                </>
              ) : (
                assignedStudents.map((student) => (
                  <li
                    key={student._id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{student.name}</span>
                    <Button
                      disabled={student?.marks?.locked}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => unassignStudent(student)}
                    >
                      Unassign
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className=" w-full sm:w-fitcontent px-4 py-2 bg-green-500 text-white rounded mt-4">
                Save
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save the changes?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={saveData}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
