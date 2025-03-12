import React from "react";

import Card from "./sections/Card";
import Intro from "./sections/Intro";
import Hero from "./sections/Hero";
import Value from "./sections/Value";
import Location from "./sections/Location";

const AboutUs: React.FC = () => {
    return (
        <div>
            <Hero />
            <Intro />
            <Value />
            <Card />
            <Location />
        </div >
    );
};

export default AboutUs;