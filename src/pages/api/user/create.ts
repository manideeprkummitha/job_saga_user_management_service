// This file contains the route handler for creating a new user in the User Management service.

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
    console.log('Database connection established.');

    if (req.method === 'POST') {
        console.log('Received POST request for creating a user');

        const { firstName, lastName, email, phone, country, city, userType, authServiceId } = req.body;
        console.log('Request body:', req.body);

        // Check for mandatory fields
        if (!firstName || !lastName || !email || !phone  || !country || !city ) {
            console.log('Missing mandatory fields');
            return res.status(400).json({ message: 'Missing mandatory fields' });
        }

        // Create a new user
        try {
            console.log('Creating new user with data:', req.body);
            const newUser = new User_management({
                firstName,
                lastName,
                email,
                phone,
                country,
                city, // Optional
                userType, // Optional
                authServiceId
            });
            await newUser.save();
            console.log('User created successfully:', newUser);
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    } else {
        console.log('Received request with invalid method:', req.method);
        res.status(405).json({ message: 'Method not allowed' });
    }
}
