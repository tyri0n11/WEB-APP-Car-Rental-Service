import axios from 'axios';

const signup = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}) => {
    try {
        const response = await axios.post('http://localhost:3000/auth/signup', data);
        console.log('Signup response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
};

export default signup;