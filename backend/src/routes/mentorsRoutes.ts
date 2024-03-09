import { Router } from "express";
import{assignStudentsToMentor, createMentor, deleteMentorById, getAllMenotrs, getMentorById, getStudentsByMentorId, updateMentorById} from '../controllers/mentorsController'


const router = Router()

router.post('/create',createMentor)
router.get("/getallmentors",getAllMenotrs);
router.get("/getmentor/:id",getMentorById);
router.put("/update/:id",updateMentorById);
router.delete("/delete/:id",deleteMentorById);
router.get("/getstudents/:id",getStudentsByMentorId);
router.post("/assignstudents/:id",assignStudentsToMentor);

export { router as mentorRoutes};