import { mentorsModel, studentModel } from "../models";
import { Request, Response, response } from "express";
import z from 'zod'
import sendEmail from "../utils/sendMail";
import { IStudent } from "../models/studentModel";



/**
 * create a student
 * @param req: Request
 * @method: POST
 * @body required: name: string,  phone:string, email:string ,password:string
 * @body optional: displayPic: string, education: string[], skills: string[], bio: string, experience: string[], linkedIn: string
 * @response: student object
 */
const createStudent = async (req: Request, res: Response) => {
    try {
        const studentSchema = z.object({
            name: z.string(),
            displayPic: z.string().optional(),
            education: z.array(z.string()).optional(),
            skills: z.array(z.string()).optional(),
            bio: z.string().optional(),
            experience: z.array(z.string()).optional(),
            linkedIn: z.string().optional(),
            codingLinks: z.array(z.string()).optional(),
            email: z.string().email(),
            phone: z.string(),
            password: z.string(),

        })
        const studentData = studentSchema.safeParse(req.body)
        if (!studentData.success) {
            return res.status(400).json({ error: studentData.error })
        }
        const findStudent = await studentModel.Students.findOne({ email: studentData.data.email })
        if (findStudent) {
            return res.status(400).json({ error: "student already exists" })
        }
        const marks = {
            marks: [{
                aspectName: "Ideation",
                marks: -1
            },
            {
                aspectName: "Execution",
                marks: -1
            },
            {
                aspectName: "Pitch",
                marks: -1
            },
            {
                aspectName: "Team Work",
                marks: -1
            },
            ],
            locked: false
        }
        const student = await studentModel.Students.create({ ...studentData.data, marks })
        return res.status(201).json(student)

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })

    }
}

/**
 * get all students
 * @param req: Request
 * @method: GET
 * @response: array of student objects
 */
const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentModel.Students.find()
        return res.status(200).json(students)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}
/**
 * get student by id
 * @param req: Request
 * @method: GET
 * @param id: student id
 * @response: student object
 */
const getStudentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "student id is required" })
        }
        const student = await studentModel.Students.findById(req.params.id)
        if (!student) {
            return res.status(404).json({ error: "student not found" })
        }
        return res.status(200).json(student)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
* update student by id
 *   @param req: Request
 * @method: PUT
 *   @param id: student id
 *   @body optional: name:string, displayPic: string, education: string[], skills: string[], bio: string, experience: string[], linkedIn: string ,githubLink: string, codingPlatforms: string[]
*/
const updateStudentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "student id is required" })
        }
        const updateStudentSchema = z.object({
            name: z.string().optional(),
            displayPic: z.string().optional(),
            education: z.array(z.string()).optional(),
            skills: z.array(z.string()).optional(),
            bio: z.string().optional(),
            experience: z.array(z.string()).optional(),
            linkedIn: z.string().optional(),
            phone: z.string().optional(),
            codingLinks: z.array(z.string()).optional(),
        })
        const studentData = updateStudentSchema.safeParse(req.body)
        if (!studentData.success) {
            return res.status(400).json({ error: studentData.error })
        }
        const student = await studentModel.Students.findByIdAndUpdate(req.params.id, studentData.data, { new: true })
        if (!student) {
            return res.status(404).json({ error: "student not found" })
        }
        return res.status(200).json(student)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
 * delete student by id
 * @param req: Request
 * @method: DELETE
 * @param id: student id
 * @response: student object
 */

const deleteStudentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "student id is required" })
        }

        const student = await studentModel.Students.findByIdAndDelete(req.params.id)
        const metnor = await mentorsModel.Mentors.updateMany({ students: req.params.id }, { $pull: { students: req.params.id } })
        if (!student) {
            return res.status(404).json({ error: "student not found" })
        }
        return res.status(200).json({ message: "student deleted successfully" })
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}


/**
 * get all unassigned students
 * @param req: Request
 * @method: GET
 * @response: array of student objects
 */
const getAllUnassignedStudents = async (req: Request, res: Response) => {
    try {
        const students = await studentModel.Students.find({ mentor: null })
        return res.status(200).json(students)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
 * update marks of a student
 * @param req: Request
 * @method: PUT
 * @param id: student id
 * @body required: marks: { aspectName: string, marks: number }[]
 */
const updateMarkById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "student id is required" })
        }
        console.log(req.body);
        const updateMarksSchema = z.object({
            marks: z.array(z.object({
                aspectName: z.string(),
                marks: z.number(),
                _id: z.string().optional()
            }))
        })
        const marksData = updateMarksSchema.safeParse(req.body)

        console.log(marksData);
        if (!marksData.success) {
            return res.status(400).json({ error: marksData.error })
        }
        const student = await studentModel.Students.findById(req.params.id)
        if (!student) {
            return res.status(404).json({ error: "student not found" })
        }
        if (student.marks.locked) {
            return res.status(400).json({ error: "marks are locked" })
        }

        const schemaAspectNames = student.marks.marks.map(mark => mark.aspectName);
        const updateAspectNames = marksData.data.marks.map(mark => mark.aspectName);

        const invalidAspectNames = updateAspectNames.filter(name => !schemaAspectNames.includes(name));
        if (invalidAspectNames.length > 0) {
            return res.status(400).json({ error: `Invalid aspect names: ${invalidAspectNames.join(', ')}` });
        }
        marksData.data.marks.forEach(updateMark => {
            const existingMark = student.marks.marks.find(mark => mark.aspectName === updateMark.aspectName);
            if (existingMark) {
                existingMark.marks = updateMark.marks;
            }
        });

        await student.save()
        return res.status(200).json(student)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}


/** 
 * lock marks of a student
 *@param req: Request
 * @method: PUT
 * @param id: student id
 * @response: student object
*/
const lockMarksOfAStudent = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "Mentor id is required" })
        }
        const studentId=req.body.studentId;
        const student = await studentModel.Students.findById({_id:studentId})
        if (!student) {
            return res.status(404).json({ error: "student not found" })
        }
        if(student.mentor===null||student.mentor===undefined){
            return res.status(400).json({ error: "student is not assigned to any mentor" })
        }
        if(student.mentor.toString()!==req.params.id){
            return res.status(400).json({ error: "student is not assigned to this mentor" })
        }
        const marks = student.marks.marks;
        if (marks.some(mark => mark.marks === -1)) {
            return res.status(400).json({ error: "marks are not complete" })
        }
        student.marks.locked = true;
        await student.save();
       const repon= await sendEmail(student.email, `Marks have been finalised and locked`);
        return res.status(200).json({student,response:repon})
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
 * lock marks of all students
 * @param req: Request
 * @method: PUT
 * @body required: studentIds: string[]
 * @response: array of student objects
 */
const lockMarksOfAllStudents = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const mentorId = req.params.id;
        if (!mentorId) {
            return res.status(400).json({ error: "Mentor id is required" })
        }

        const lockMarksSchema = z.object({
            studentIds: z.array(z.string())
        })
        const lockMarksData = lockMarksSchema.safeParse(req.body)
        console.log(lockMarksData);
        if (!lockMarksData.success) {
            return res.status(400).json({ error: lockMarksData.error })
        }
        const students = await studentModel.Students.find({ _id: { $in: lockMarksData.data.studentIds } })
        const mentorMismatch = students.some((student:IStudent) => student.mentor?.toString() !== mentorId);
        if (mentorMismatch) {
            return res.status(400).json({ error: "some students are not assigned to this mentor" })
        }
        const incompleteMarks = students.filter(student => student.marks.marks.some(mark => mark.marks === -1));
        if (incompleteMarks.length > 0) {
            return res.status(400).json({ error: "some students have incomplete marks" })
        }
        const updateOperation = { $set: { "marks.locked": true } };

        // Update documents in the MongoDB collection
        await studentModel.Students.updateMany(
            { _id: { $in: lockMarksData.data.studentIds } }, // Filter to match documents
            updateOperation // Update operation
        );
        const studentEmails = students.map(student => student.email);
        const promises = studentEmails.map(email => sendEmail(email, `Marks have been finalised and locked`));
        await Promise.all(promises);
        
        return res.status(200).json(students)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

export {
    createStudent,
    getAllStudents,
    getStudentById,
    deleteStudentById,
    updateStudentById,
    getAllUnassignedStudents,
    updateMarkById,
    lockMarksOfAStudent,
    lockMarksOfAllStudents
}