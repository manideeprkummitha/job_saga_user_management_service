// /pages/api/user/read.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@/lib/db';
import User_management from '@/models/User_management';
import runMiddleware from '@/utils/corsConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Running CORS middleware...');
    await runMiddleware(req, res); // Run CORS middleware
    console.log('CORS middleware finished.');

    console.log('Connecting to database...');
    await connectDb();

    if (req.method === 'GET') {
        console.log('Received GET request for reading all users');
        try {
            const users = await User_management.find();
            console.log('Users retrieved successfully:', users);
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error reading users:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    } else {
        console.log('Received request with invalid method:', req.method);
        res.status(405).json({ message: 'Method not allowed' });
    }
}
