import React from "react";
import Intro from "./sections/Intro";
import WhyUs from "./sections/WhyUs";
import Mission from "./sections/Mission";

const AboutUs: React.FC = () => {
    return (
        <div>
            <Intro />
            <WhyUs />
            <Mission />
        </div>
    );
};

export default AboutUs;
