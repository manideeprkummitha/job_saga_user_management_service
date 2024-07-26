import mongoose, { Schema, Document } from 'mongoose';

interface IContact {
    fullName: string;
    company: string;
    location: string;
    goal: string;
    status: string;
    followUp: Date;
}

interface IUserContact extends Document {
    userId: string;
    contacts: IContact[];
}

const ContactSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    goal: { type: String, required: true },
    status: { type: String, required: true },
    followUp: { type: Date, required: true },
});

const UserContactSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    contacts: { type: [ContactSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.UserContact || mongoose.model<IUserContact>('UserContact', UserContactSchema);
