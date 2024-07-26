import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../lib/db';
import UserCompany from '@/models/Company';
import axios from 'axios';
import runMiddleware from '@/utils/corsConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Running CORS middleware...');
    await runMiddleware(req, res); // Run CORS middleware

    console.log('Connecting to the database...');
    await connectDb();
    console.log('Database connected.');

    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    console.log('Authorization token:', token);

    if (!token) {
        console.log('Authorization token missing');
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        // Call the "me" API to get the user ID
        console.log('Calling me API to fetch user details...');
        const userResponse = await axios.get('http://localhost:7001/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const userId = userResponse.data.user._id; // Adjust based on your API response
        console.log('User ID retrieved from me API:', userId);

        if (req.method === 'GET') {
            console.log('Retrieving all companies...');
            const companies = await UserCompany.find();
            console.log('Retrieved all companies:', companies);
            return res.status(200).json(companies);
        }

        if (req.method === 'POST') {
            const { companies } = req.body;
            console.log('Creating new user company:', { userId, companies });
            const newUserCompany = new UserCompany({ userId, companies });
            await newUserCompany.save();
            console.log('User company created:', newUserCompany);

            // Update the UserManagement document with the new companyServiceId
            console.log(`Updating user with ID ${userId} to set companyServiceId...`);
            await axios.put(`http://localhost:7002/api/user/${userId}`, {
                companyServiceId: newUserCompany._id,
            });
            console.log('User updated successfully with companyServiceId:', newUserCompany._id);

            return res.status(201).json(newUserCompany);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        console.log(`Method ${req.method} Not Allowed`);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error:any) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
