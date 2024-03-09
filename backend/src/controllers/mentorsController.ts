import { mentorsModel, studentModel } from "../models";
import { Request, Response } from "express";
import mongoose from "mongoose";
import z from 'zod'

/**
 * create a mentor
  @param req: Request
  @method: POST
  @body required: name: string,  phone:string, email:string ,password:string
  @body optional: displayPic: string, education: string[], skills: string[], bio: string, experience: string[], linkedIn: string
  @response: mentor object
 */
const createMentor = async (req: Request, res: Response) => {
    try {
        const mentorSchema = z.object({
            name: z.string(),
            displayPic: z.string().optional(),
            education: z.array(z.string()).optional(),
            skills: z.array(z.string()).optional(),
            bio: z.string().optional(),
            experience: z.array(z.string()).optional(),
            linkedIn: z.string().optional(),
            email: z.string().email(),
            phone: z.string(),
            password: z.string()
        })
        const mentorData = mentorSchema.safeParse(req.body)
        if (!mentorData.success) {
            return res.status(400).json({ error: mentorData.error })
        }
        const findMentor = await mentorsModel.Mentors.findOne({ email: mentorData.data.email })
        if (findMentor) {
            return res.status(400).json({ error: "mentor already exists" })
        }
        const mentor = await mentorsModel.Mentors.create(mentorData.data)
        return res.status(201).json(mentor)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })

    }
}


/**
 * get all mentors
  @param req: Request
  @method: GET
  @response: array of mentor objects
 */
const getAllMenotrs = async (req: Request, res: Response) => {
    try {
        const mentors = await mentorsModel.Mentors.find()
        return res.status(200).json(mentors)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}


/**
 * get mentor by id
  @param req: Request
  @method: GET
  @param id: mentor id
  @response: mentor object
 */
const getMentorById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "mentor id is required" })
        }
        const mentor = await mentorsModel.Mentors.findById(req.params.id)
        if (!mentor) {
            return res.status(404).json({ error: "mentor not found" })
        }
        return res.status(200).json(mentor)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}


/**
 * update mentor by id
  @param req: Request
  @method: PUT
  @param id: mentor id
  @body optional: name: string,  phone:string, email:string ,password:string, displayPic: string, education: string[], skills: string[], bio: string, experience: string[], linkedIn: string
  @response: mentor object
 */
const updateMentorById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "mentor id is required" })
        }
        const updateMentorSchema = z.object({
            name: z.string().optional(),
            displayPic: z.string().optional(),
            education: z.array(z.string()).optional(),
            skills: z.array(z.string()).optional(),
            bio: z.string().optional(),
            experience: z.array(z.string()).optional(),
            linkedIn: z.string().optional(),
            phone: z.string().optional(),

        })
        const mentorData = updateMentorSchema.safeParse(req.body)
        if (!mentorData.success) {
            return res.status(400).json({ error: mentorData.error })
        }
        const mentor = await mentorsModel.Mentors.findByIdAndUpdate(req.params.id, mentorData.data, { new: true })
        if (!mentor) {
            return res.status(404).json({ error: "mentor not found" })
        }
        return res.status(200).json(mentor)
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
 * delete mentor by id
     @param req: Request
     @method: DELETE
     @param id: mentor id
     @response: mentor object
*/
const deleteMentorById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "mentor id is required" })
        }
        const mentor = await mentorsModel.Mentors.findByIdAndDelete(req.params.id)
        if (!mentor) {
            return res.status(404).json({ error: "mentor not found" })
        }
        const students = await studentModel.Students.updateMany({ mentor: mentor._id }, { mentor: null })

        return res.status(200).json({ message: "mentor deleted successfully" })
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
    * get all students of a mentor
     @param req: Request
     @method: GET
     @param id: mentor id
     @response: array of student objects
*/

const getStudentsByMentorId = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "mentor id is required" })
        }
        const mentor = await mentorsModel.Mentors.findById(req.params.id).populate("students")
        if (!mentor) {
            return res.status(404).json({ error: "mentor not found" })
        }
        return res.status(200).json(mentor.students)
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
}

/**
 * assign students to a mentor
    @param req: Request
    @method: POST
    @param id: mentor id
    @body required: students: array of student ids
    @response: mentor object
*/

const assignStudentsToMentor = async (req: Request, res: Response) => {

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        if (!req.params.id) {
            await session.abortTransaction();
            return res.status(400).json({ error: "mentor id is required" });
        }
        const mentor = await mentorsModel.Mentors.findById(req.params.id);
        if (!mentor) {
            await session.abortTransaction();
            return res.status(404).json({ error: "mentor not found" })
        }
        const students = req.body.students;
        if (!students) {
            await session.abortTransaction();
            return res.status(400).json({ error: "students are required" })
        }
        if (students.length === 0) {
            const findStudentsAndInsertMentor = await studentModel.Students.updateMany({ mentor: mentor._id }, { mentor: null });
            mentor.students = students;
            await mentor.save();
            await session.commitTransaction();
            return res.status(200).json(mentor);
        }
        if (students.length > 4 || students.length < 3) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Mentor can have 3 to 4 students" })
        }
        const differentMentorAssigned = await studentModel.Students.find({
            _id: { $in: students },
            mentor: { $nin: [null, req.params.id] }
        });
        if (differentMentorAssigned.length > 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: "students are already assigned to a different mentor" });
        }
        if (mentor.students != undefined) {
            const filterId = mentor.students.filter((id: any) => !students.includes(id));
            const findStudentsAndRemove = await studentModel.Students.updateMany({ _id: { $in: filterId } }, { mentor: null })
        }
        mentor.students = students;
        const findStudentsAndInsertMentor = await studentModel.Students.updateMany({ _id: { $in: students } }, { mentor: mentor._id })

        await mentor.save();
        await session.commitTransaction();
        const mentorPopulated = await mentorsModel.Mentors.findById(req.params.id).populate("students")
        return res.status(200).json(mentorPopulated)

    } catch (error: any) {
        await session.abortTransaction();
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}





export {
    createMentor,
    getAllMenotrs,
    getMentorById,
    updateMentorById,
    deleteMentorById,
    getStudentsByMentorId,
    assignStudentsToMentor
}