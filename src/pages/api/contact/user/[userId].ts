import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../../lib/db';
import UserContact from '@/models/Contacts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    console.log('Database connected.');

    const { userId } = req.query;
    console.log(`Received request for user ID: ${userId}`);

    if (req.method === 'GET') {
        const userContact = await UserContact.findOne({ userId });
        if (!userContact) {
            console.log('User contacts not found');
            return res.status(404).json({ message: 'User contacts not found' });
        }
        console.log('Retrieved user contacts:', userContact.contacts);
        return res.status(200).json(userContact.contacts);
    }

    res.setHeader('Allow', ['GET']);
    console.log(`Method ${req.method} Not Allowed`);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
