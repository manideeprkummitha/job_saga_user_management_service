import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../lib/db';
import UserContact from '@/models/Contacts';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    console.log('Database connected.');

    const { id } = req.query;
    console.log(`Received request for contact ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
        console.log('Invalid contact ID');
        return res.status(400).json({ message: 'Invalid contact ID' });
    }

    if (req.method === 'GET') {
        const userContact = await UserContact.findOne({ 'contacts._id': id });
        if (!userContact) {
            console.log('Contact not found');
            return res.status(404).json({ message: 'Contact not found' });
        }
        const specificContact = userContact.contacts.id(id);
        console.log('Retrieved contact:', specificContact);
        return res.status(200).json(specificContact);
    }

    if (req.method === 'PUT') {
        const { fullName, company, location, goal, status, followUp } = req.body;
        const userContact = await UserContact.findOne({ 'contacts._id': id });
        if (!userContact) {
            console.log('Contact not found');
            return res.status(404).json({ message: 'Contact not found' });
        }
        const specificContact = userContact.contacts.id(id);
        specificContact.fullName = fullName;
        specificContact.company = company;
        specificContact.location = location;
        specificContact.goal = goal;
        specificContact.status = status;
        specificContact.followUp = followUp;
        await userContact.save();
        console.log('Contact updated:', specificContact);
        return res.status(200).json(specificContact);
    }

    if (req.method === 'DELETE') {
        const userContact = await UserContact.findOneAndUpdate(
            { 'contacts._id': id },
            { $pull: { contacts: { _id: id } } },
            { new: true }
        );
        if (!userContact) {
            console.log('Contact not found');
            return res.status(404).json({ message: 'Contact not found' });
        }
        console.log('Contact deleted');
        return res.status(200).json({ message: 'Contact deleted' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    console.log(`Method ${req.method} Not Allowed`);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
