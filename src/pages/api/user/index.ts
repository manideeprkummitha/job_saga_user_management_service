// /pages/api/user/index.ts
// This file serves as an entry point to route handlers for user management.

import { NextApiRequest, NextApiResponse } from 'next';
import createHandler from './create';
import readHandler from './read';
import runMiddleware from '@/utils/corsConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Running CORS middleware...');
    await runMiddleware(req, res); // Run CORS middleware
    console.log('CORS middleware finished.');

    if (req.method === 'POST') {
        return createHandler(req, res);
    } else if (req.method === 'GET') {
        return readHandler(req, res);
    } else {
        console.log('Received request with invalid method:', req.method);
        res.status(405).json({ message: 'Method not allowed' });
    }
}
