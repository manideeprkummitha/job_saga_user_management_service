import mongoose, { Schema, Document } from 'mongoose';

export interface IUserManagement extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  country: string;
  userType?: 'job seeker' | 'recruiter';
  currentJob: {
    title: string;
    company: string;
    yearsOfExperience: number;
    resume?: string;
  };
  education: {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    yearOfGraduation: number;
  }[];
  certifications: {
    name: string;
    issuingOrganization: string;
    year: number;
  }[];
  urls: {
    linkedin?: string;
    github?: string;
    leetcode?: string;
  };
  skillSet: string[];
  experiences: {
    title: string;
    company: string;
    yearsOfExperience: number;
    description?: string;
  }[];
  languages: string[];
  conversations: mongoose.Types.ObjectId[];
  authServiceId: string;
  resumeServiceId: string;
  companyServiceId: string;
  contactServiceId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserManagementSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    city: { type: String }, // Optional
    country: { type: String, required: true },
    userType: { type: String, enum: ['job seeker', 'recruiter'] }, // Optional
    currentJob: {
      title: { type: String },
      company: { type: String },
      yearsOfExperience: { type: Number },
      resume: { type: String },
    },
    education: [{
      degree: { type: String },
      fieldOfStudy: { type: String },
      institution: { type: String },
      yearOfGraduation: { type: Number },
    }],
    certifications: [{
      name: { type: String },
      issuingOrganization: { type: String },
      year: { type: Number },
    }],
    urls: {
      linkedin: { type: String },
      github: { type: String },
      leetcode: { type: String },
    },
    skillSet: { type: [String] },
    experiences: [{
      title: { type: String },
      company: { type: String },
      yearsOfExperience: { type: Number },
      description: { type: String },
    }],
    languages: { type: [String] },
    conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }], // References to conversations
    authServiceId: { type: String },
    resumeServiceId: { type: String },
    companyServiceId: { type: String },
    contactServiceId: { type: String },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

const UserManagement = mongoose.models.User_management || mongoose.model<IUserManagement>('User_management', UserManagementSchema);

export default UserManagement;
