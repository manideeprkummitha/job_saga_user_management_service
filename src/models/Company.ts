import mongoose, { Schema, Document } from 'mongoose';

interface ICompany {
    name: string;
    industry: string;
    location: string;
    size: string;
    type: string;
    status: string;
}

interface IUserCompany extends Document {
    userId: string;
    companies: ICompany[];
}

const CompanySchema: Schema = new Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
});

const UserCompanySchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    companies: { type: [CompanySchema], default: [] },
}, { timestamps: true });

export default mongoose.models.UserCompany || mongoose.model<IUserCompany>('UserCompany', UserCompanySchema);
