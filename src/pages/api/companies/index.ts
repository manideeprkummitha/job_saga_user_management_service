import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../lib/db';
import UserCompany from '@/models/Company';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDb();
    console.log('Database connected.');

    if (req.method === 'GET') {
        const companies = await UserCompany.find();
        console.log('Retrieved all companies:', companies);
        return res.status(200).json(companies);
    }

    if (req.method === 'POST') {
        const { userId, companies } = req.body;
        console.log('Creating new user company:', { userId, companies });
        const newUserCompany = new UserCompany({ userId, companies });
        await newUserCompany.save();
        console.log('User company created:', newUserCompany);
        return res.status(201).json(newUserCompany);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    console.log(`Method ${req.method} Not Allowed`);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
