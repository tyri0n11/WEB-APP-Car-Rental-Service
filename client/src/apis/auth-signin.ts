import axios from 'axios';

const signin = async (data: { email: string, password: string }) => {
    try {
        const response = await axios.post('http://localhost:3000/auth/login', data);
        console.log('Signin response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signin:', error);
        throw error;
    }
}

export default signin;