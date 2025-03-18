import React from "react";

import Card from "./sections/Card";
import Intro from "./sections/Intro";
import Hero from "./sections/Hero";
import Value from "./sections/Value";
import Location from "./sections/Location";

const AboutUs: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "100vw",
                overflowX: "hidden",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                width: "100%",
            }}
        >
            <Hero />
            <Intro />
            <Value />
            <Card />
            <Location />
        </div>
    );
};

export default AboutUs;
