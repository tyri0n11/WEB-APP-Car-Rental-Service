import React from 'react';
interface TitleContentCardProps {
    title: string;
    content: string;
}

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '400px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

    },
    title: {
        fontSize: '1.25rem',
        textAlign: 'left',
        margin: '0 0 8px 0',
    },
    content: {
        textAlign: 'left',
        margin: '0',
    },
} as const;

const TitleContentCard: React.FC<TitleContentCardProps> = ({ title, content }) => {
    return (
        <div style={styles.card}>
            <h5 style={styles.title}>
                {title}
            </h5>
            <p style={styles.content}>
                {content}
            </p>
        </div>
    );
};

export default TitleContentCard;
