import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../../lib/db';
import UserCompany from '@/models/Company';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    console.log('Database connected.');

    const { userId } = req.query;
    console.log(`Received request for user ID: ${userId}`);

    if (req.method === 'GET') {
        const userCompany = await UserCompany.findOne({ userId });
        if (!userCompany) {
            console.log('User companies not found');
            return res.status(404).json({ message: 'User companies not found' });
        }
        console.log('Retrieved user companies:', userCompany.companies);
        return res.status(200).json(userCompany.companies);
    }

    res.setHeader('Allow', ['GET']);
    console.log(`Method ${req.method} Not Allowed`);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
