import React from 'react';

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem',
    },
    box: {
        marginTop: '5rem',
    },
    buttonBox: {
        marginTop: '3rem',
        textAlign: 'center',
    },
    textField: {
        width: '100%',
        margin: '0.5rem 0',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonHover: {
        backgroundColor: '#115293',
    },
};

const Profile: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h4>Profile</h4>
                <form noValidate autoComplete="off">
                    <input
                        type="text"
                        placeholder="Full Name"
                        style={styles.textField}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        style={styles.textField}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        style={styles.textField}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        style={styles.textField}
                    />
                    <div style={styles.buttonBox}>
                        <button
                            type="submit"
                            style={styles.button}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;