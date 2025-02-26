import { Typography, Button } from "@mui/material";

const Hero: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "90vh",
        overflow: "hidden",
        margin: "auto",
        scrollBehavior: "smooth",
      }}
    >
      {/* Background layer replicating the <wow-image> style */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100vh",
          transform: "translate(-50%, -50%)",
          backgroundImage:
            'url("https://static.wixstatic.com/media/c54d35_10dddcb64dc84f3ba1d610c0344bc59a~mv2.jpg/v1/fill/w_1612,h_1390,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c54d35_10dddcb64dc84f3ba1d610c0344bc59a~mv2.jpg")',
          backgroundSize: "cover", // equivalent to object-fit: cover
          backgroundPosition: "50% 50%", // equivalent to object-position: 50% 50%
          zIndex: -1,
        }}
      />
      {/* Content layer */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "#007bff",
          textAlign: "center",
          zIndex: 1,
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
      </div>
    </div>
  );
};

export default Hero;
