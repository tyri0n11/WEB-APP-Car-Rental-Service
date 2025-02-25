import { Box, Typography, Button } from "@mui/material";
import images from "../../../../assets/index";

const Hero: React.FC = () => {



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        position: "relative",
        overflow: "hidden",
        color: "#007bff",
        textAlign: "center",
        padding: "40px 20px",
        margin: "auto",
        backgroundColor: "rgba(220, 231, 240, 0.66)",
        backgroundImage: `url(${images.vinlux})`, 
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Rent Your Dream Car
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        Choose from a wide range of luxury and economy cars
      </Typography>
      <Button variant="contained" color="primary" size="large">
        Get Started
      </Button>
    </Box>
  );
};

export default Hero;
