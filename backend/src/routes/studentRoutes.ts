import { Router } from "express";
import { createStudent, deleteStudentById, getAllStudents, getAllUnassignedStudents, getStudentById, lockMarksOfAStudent, lockMarksOfAllStudents, updateMarkById, updateStudentById } from "../controllers";
const router = Router();

router.post("/create",createStudent);
router.get("/getallstudents", getAllStudents);
router.get("/getstudentbyid/:id", getStudentById);
router.put("/update/:id", updateStudentById);
router.delete("/delete/:id", deleteStudentById);
router.get("/getallunassignedstudents", getAllUnassignedStudents);
router.put("/updatemark/:id", updateMarkById);
router.put("/lockmarkofstudent/:id", lockMarksOfAStudent);
router.put("/lockmarkofallstudents/:id",lockMarksOfAllStudents );


export { router as studentRoutes};