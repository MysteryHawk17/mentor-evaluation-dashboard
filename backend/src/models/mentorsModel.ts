import mongoose,{Document} from "mongoose";

interface IMentors {
    name: string,
    displayPic?: string,
    education?: string[],
    skills?: string[],
    bio?: string,
    experience?: string[],
    linkedIn?: string,
    email: string,
    phone: string,
    students?: any[],
    password: string,
    // courses: any[],
}

const mentorsSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        default:"DEFAULT_PASSWORD"//should be updated when proper authentication is implemented
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
    },],
    // courses: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Courses",
    // }], 
    /* Should be added to give description for the courses the mentor is involved with */


});

const Mentors = mongoose.model<IMentors & Document>("Mentors", mentorsSchema);
export { Mentors, IMentors };

