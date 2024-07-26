import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '@/lib/db';
import User_management from '@/models/User_management';
import runMiddleware from '@/utils/corsConfig';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Running CORS middleware...');
    await runMiddleware(req, res); // Run CORS middleware
    console.log('CORS middleware finished.');

    const { id } = req.query;

    console.log('Connecting to the database...');
    await connectDb();
    console.log('Database connection established.');

    if (req.method === 'PUT') {
        console.log('Received PUT request for updating user with ID:', id);
        console.log('Request body:', req.body);

        try {
            const updatedUser = await User_management.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedUser) {
                console.log('User not found for ID:', id);
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User updated successfully:', updatedUser);
            return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    } else if (req.method === 'DELETE') {
        console.log('Received DELETE request for user with ID:', id);

        try {
            const deletedUser = await User_management.findByIdAndDelete(id);
            if (!deletedUser) {
                console.log('User not found for ID:', id);
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User deleted successfully for ID:', id);
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    } else if (req.method === 'GET') {
        console.log('Received GET request for user with ID:', id);

        try {
            const user = await User_management.findById(id);
            if (!user) {
                console.log('User not found for ID:', id);
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User retrieved successfully:', user);
            return res.status(200).json({ user });
        } catch (error) {
            console.error('Error reading user:', error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    } else {
        console.log('Received request with invalid method:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
