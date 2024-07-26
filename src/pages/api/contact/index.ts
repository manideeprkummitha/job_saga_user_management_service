import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../lib/db';
import UserContact from '@/models/Contacts';
import UserManagement from '@/models/User_management';
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
            const contacts = await UserContact.find({ userId });
            console.log('Retrieved all contacts:', contacts);
            return res.status(200).json(contacts);
        }

        if (req.method === 'POST') {
            const { contacts } = req.body;
            console.log('Creating new user contact:', { userId, contacts });
            const newUserContact = new UserContact({ userId, contacts });
            await newUserContact.save();
            console.log('User contact created:', newUserContact);

            // Update UserManagement with new contactServiceId
            console.log(`Updating user with ID ${userId} to set contactServiceId...`);
            await UserManagement.findByIdAndUpdate(userId, {
                contactServiceId: newUserContact._id,
            });
            console.log('User updated successfully with contactServiceId:', newUserContact._id);

            return res.status(201).json(newUserContact);
        }

        res.setHeader('Allow', ['GET', 'POST']);
        console.log(`Method ${req.method} Not Allowed`);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error: any) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
