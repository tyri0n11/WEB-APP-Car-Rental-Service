import React from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const Services: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.servicesContainer}>
      <Typography variant="h4" gutterBottom>
        Our Fleet – Choose Your Ride
      </Typography>
      <Typography variant="body1" gutterBottom>
        We offer a diverse selection of vehicles to suit every journey:
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'Economy Cars', description: 'Budget-friendly and fuel-efficient' },
          { title: 'Sedans', description: 'Comfortable and stylish for business or family use' },
          { title: 'SUVs & 4x4s', description: 'Power and space for long trips and rough terrains' },
          { title: 'Luxury & Sports Cars', description: 'Drive in style with high-end vehicles' },
          { title: 'Vans & Minibuses', description: 'Perfect for group travels' },
        ].map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.serviceCard}>
              <CardContent>
                <Typography variant="h6" className={classes.serviceTitle}>
                  {service.title}
                </Typography>
                <Typography variant="body2" className={classes.serviceDescription}>
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" className={classes.rentalPlans}>
        🎯 Flexible Rental Plans – Daily, weekly, and monthly options available!
      </Typography>
      <Button variant="contained" color="primary" className={classes.viewAllButton}>
        View All Cars
      </Button>
    </div>
  );
};

const useStyles = makeStyles({
    servicesContainer: {
      padding: '2rem',
      backgroundColor: '#f5f5f5',
    },
    serviceCard: {
      height: '100%',
    },
    serviceTitle: {
      marginBottom: '1rem',
    },
    serviceDescription: {
      marginBottom: '1rem',
    },
    rentalPlans: {
      marginTop: '2rem',
    },
    viewAllButton: {
      marginTop: '1rem',
    },
  });
  
export default Services;