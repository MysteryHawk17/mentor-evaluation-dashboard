import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useParams, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";
import axios from "axios";
interface Student {
  _id: string;
  name: string;
  displayPic?: string;
  education?: string[];
  skills?: string[];
  bio?: string;
  experience?: string[];
  linkedIn?: string;
  githubLink?: string;
  codingLinks?: string[];
  email: string;
  phone: string;
  mentor?: string | null;
  password: string;
  marks: {
    marks: {
      aspectName: string;
      marks: number;
    }[];
    locked: boolean;
  };
}
export default function MarksTable() {
  const { id } = useParams();
  console.log(id);
  const [studentData, setStudentData] = useState<Student[]>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mentor/getstudents/${id}`)
      .then((res) => {
        setStudentData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [aspect1, setAspect1] = useState(1);
  const [aspect2, setAspect2] = useState(1);
  const [aspect3, setAspect3] = useState(1);
  const [aspect4, setAspect4] = useState(1);

  const handleClick = (student: string) => {
    setEditMode((prev) => ({ ...prev, [student]: !prev[student] }));
    const findStudent = studentData.find((s) => s._id === student);
    if (findStudent) {
      findStudent.marks.marks[0].marks = aspect1;
      findStudent.marks.marks[1].marks = aspect2;
      findStudent.marks.marks[2].marks = aspect3;
      findStudent.marks.marks[3].marks = aspect4;
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/student/updatemark/${findStudent?._id}`,
        findStudent?.marks
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEdit = (studentId: string) => {
    const student = studentData.find((student) => student._id === studentId);
    if (student) {
      setEditMode((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
      setAspect1(
        student.marks.marks[0].marks == -1 ? 0 : student.marks.marks[0].marks
      );
      setAspect2(
        student.marks.marks[1].marks == -1 ? 0 : student.marks.marks[1].marks
      );
      setAspect3(
        student.marks.marks[2].marks == -1 ? 0 : student.marks.marks[2].marks
      );
      setAspect4(
        student.marks.marks[3].marks == -1 ? 0 : student.marks.marks[3].marks
      );
    }
  };

  const handleInputChange = (
    setter: (value: number) => void,
    value: string
  ) => {
    setter(parseInt(value));
  };
  const handleLockAll = () => {
    const allStudentId = studentData.map((s) => s._id);
    const obj = { studentIds: allStudentId };
    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/student/lockmarkofallstudents/${id}`, obj)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleOneLock = (studentId: string) => {
    console.log("hello");
    console.log(studentId);
    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/student/lockmarkofstudent/${id}`,{studentId:studentId})
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  interface CsvData {
    name: string;
    aspect1: number;
    aspect2: number;
    aspect3: number;
    aspect4: number;
    total: number;
  }
  const [csvData, setCsvData] = useState<CsvData[]>([]);

  // console.log(studentData[0].marks.marks[0].aspectName)
  return (
    <div className="p-2 m-3  overflow-x-auto bg-sec">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="">
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>{studentData[0]?.marks?.marks[0]?.aspectName}</TableHead>
            <TableHead>{studentData[0]?.marks?.marks[1]?.aspectName}</TableHead>
            <TableHead>{studentData[0]?.marks?.marks[2]?.aspectName}</TableHead>
            <TableHead>{studentData[0]?.marks?.marks[3]?.aspectName}</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">
              <Button className="mr-2 bg-green-500 ">
                <CSVLink
                  data={csvData}
                  asyncOnClick={true}
                  onClick={() => {
                    const data = studentData.map((student) => {
                      return {
                        name: student.name,
                        aspect1: student.marks.marks[0].marks,
                        aspect2: student.marks.marks[1].marks,
                        aspect3: student.marks.marks[2].marks,
                        aspect4: student.marks.marks[3].marks,
                        total:
                          student.marks.marks[0].marks +
                          student.marks.marks[1].marks +
                          student.marks.marks[2].marks +
                          student.marks.marks[3].marks,
                      };
                    });
                    setCsvData(data);
                  }}
                >
                  Download
                </CSVLink>
              </Button>

              <Button className="ml-2 bg-red-600" onClick={handleLockAll}>
                Lock All
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentData.map((student) => (
            <TableRow key={student._id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              {!editMode[student._id] && (
                <>
                  <TableCell>
                    {student.marks.marks[0].marks == -1
                      ? 0
                      : student.marks.marks[0].marks}
                  </TableCell>
                  <TableCell>
                    {student.marks.marks[1].marks == -1
                      ? 0
                      : student.marks.marks[1].marks}
                  </TableCell>
                  <TableCell>
                    {student.marks.marks[2].marks == -1
                      ? 0
                      : student.marks.marks[2].marks}
                  </TableCell>
                  <TableCell>
                    {student.marks.marks[3].marks == -1
                      ? 0
                      : student.marks.marks[3].marks}
                  </TableCell>
                  <TableCell>
                    {student.marks.marks[0].marks +
                      student.marks.marks[1].marks +
                      student.marks.marks[2].marks +
                      student.marks.marks[3].marks ==
                    -4
                      ? 0
                      : student.marks.marks[0].marks +
                        student.marks.marks[1].marks +
                        student.marks.marks[2].marks +
                        student.marks.marks[3].marks}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={student.marks.locked}
                      className="m-1 bg-butPrim hover:bg-butSec"
                      onClick={() => handleEdit(student._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="m-1 bg-red-600"
                      type="submit"
                      onClick={() => handleOneLock(student._id)}
                    >
                      Lock
                    </Button>
                  </TableCell>
                </>
              )}
              {editMode[student._id] && (
                <>
                  <TableCell>
                    <Input
                      value={aspect1}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(setAspect1, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={aspect2}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(setAspect2, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={aspect3}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(setAspect3, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={aspect4}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(setAspect4, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>{aspect1 + aspect2 + aspect3 + aspect4}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="m-1 bg-blue-600 hover:bg-blue-700"
                      type="submit"
                      onClick={() => {
                        handleClick(student._id);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      className="m-1 bg-red-600"
                      type="submit"
                      disabled={true}
                      onClick={() => handleOneLock(student._id)}
                    >
                      Lock
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}