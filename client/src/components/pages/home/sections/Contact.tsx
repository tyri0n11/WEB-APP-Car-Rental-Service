import React from 'react';

const styles = {
  contactContainer: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    
  },
  heading: {
    marginBottom: '1rem',
  },
  subheading: {
    marginBottom: '1rem',
  },
  contactButton: {
    margin: '1rem 0',
    padding: '10px 20px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  contactButtonHover: {
    backgroundColor: '#0056b3',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
  },
};

const Contact: React.FC = () => {
  return (
    <div>
    <div style={styles.contactContainer}>
      <h4 style={styles.heading}>📍 Contact Us</h4>
      <h6 style={styles.subheading}>📌 Location: [Your Garage Address]</h6>
      <h6 style={styles.subheading}>📞 Call Us: [Your Phone Number]</h6>
      <h6 style={styles.subheading}>✉️ Email: [Your Email Address]</h6>
      <button
        style={styles.contactButton}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.contactButtonHover.backgroundColor)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.contactButton.backgroundColor)}
      >
        Get a Quote
      </button>
      <h6 style={styles.subheading}>📅 Open Hours: Monday – Sunday | 8 AM – 8 PM</h6>
      <h6 style={styles.subheading}>Follow us on:</h6>
      <div style={styles.socialLinks}>
        <a href="[Facebook Link]" target="_blank" rel="noopener noreferrer">
          <img src="path/to/facebook-icon.png" alt="Facebook" style={styles.socialIcon} />
        </a>
        <a href="[Twitter Link]" target="_blank" rel="noopener noreferrer">
          <img src="path/to/twitter-icon.png" alt="Twitter" style={styles.socialIcon} />
        </a>
        <a href="[Instagram Link]" target="_blank" rel="noopener noreferrer">
          <img src="path/to/instagram-icon.png" alt="Instagram" style={styles.socialIcon} />
        </a>
      </div>
    </div>
    </div>
  );
};

export default Contact;