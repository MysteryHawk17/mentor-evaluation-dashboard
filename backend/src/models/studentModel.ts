import mongoose, { Document } from "mongoose";


interface IStudent {
    name: string,
    displayPic?: string,
    education?: string[],
    skills?: string[],
    bio?: string,
    experience?: string[],
    linkedIn?: string,
    githubLink?: string,
    codingLinks?: string[],
    email: string,
    phone: string,
    mentor?: mongoose.Schema.Types.ObjectId,
    password: string,
    marks: {
        marks: {
            aspectName: string,
            marks: number,
        }[],
        locked:boolean,
    }
}

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    displayPic: {
        type: String,
    },
    education: [{
        type: String,
    }],
    skills: [{
        type: String,
    }],
    bio: {
        type: String,
    },
    experience: [{
        type: String,
    }],
    linkedIn: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    codingLinks: [{
        type: String,
    }],
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        default: "DEFAULT_PASSWORD"//should be updated when proper authentication is implemented
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentors",
        default: null,
    },
    marks: {
        marks: [{
            aspectName: {
                type: String,
                required: true
            },
            marks: {
                type: Number,
                default: -1,
                required: true
            },
        },
        ],
        locked:{
            type:Boolean,
            default:false,
        }
    },
    /**
     * Should add courses in which the student is enrolled 
     */
})

const Students = mongoose.model<IStudent & Document>("Students", studentSchema);
export { Students, IStudent };