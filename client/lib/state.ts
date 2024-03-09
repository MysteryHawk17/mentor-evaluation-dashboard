'use client'
import { atom, selector } from 'recoil';



export interface Mentor {
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
export interface Student {
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
export const mentorState=atom<Mentor[]>({
    key:'mentors',
    default:[]
})

export const userState=atom<Mentor>({
    key:'user',
    default:{
        _id:'',
        name:'',
        email:'',
        phone:'',
        password:'',
    }
})

export const assignedStudentsState=atom<Student[]>({
    key:'assignedStudents',
    default:[]
})

export const unassignedStudentsState=atom<Student[]>({
    key:'unassignedStudents',
    default:[]
})

