import React, { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    footer: {
        display: 'block',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        margin: '0 auto',
        
    },
    footerNav: {
        display: 'flex',
        gap: '1rem',
    },
};
const Footer: React.FC = () => {
    return (
        <footer style={styles.footer }>
            <div style={styles.footerContent}>
                <p>&copy; {new Date().getFullYear()} Car Rental Service. All rights reserved.</p>
                <nav style={styles.footerNav}>
                    <p>Production of Hope</p>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;