import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Contact: React.FC = () => {
    return (
        <Box sx={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" gutterBottom>
                📍 Contact Us
            </Typography>
            <Typography variant="h6" gutterBottom>
                📌 Location: [Your Garage Address]
            </Typography>
            <Typography variant="h6" gutterBottom>
                📞 Call Us: [Your Phone Number]
            </Typography>
            <Typography variant="h6" gutterBottom>
                ✉️ Email: [Your Email Address]
            </Typography>
            <Button variant="contained" color="primary" sx={{ margin: '1rem 0' }}>
                Get a Quote
            </Button>
            <Typography variant="h6" gutterBottom>
                📅 Open Hours: Monday – Sunday | 8 AM – 8 PM
            </Typography>
            <Typography variant="h6" gutterBottom>
                Follow us on:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link href="[Facebook Link]" target="_blank" rel="noopener">
                    <Facebook fontSize="large" />
                </Link>
                <Link href="[Twitter Link]" target="_blank" rel="noopener">
                    <Twitter fontSize="large" />
                </Link>
                <Link href="[Instagram Link]" target="_blank" rel="noopener">
                    <Instagram fontSize="large" />
                </Link>
            </Box>
        </Box>
    );
};

export default Contact;