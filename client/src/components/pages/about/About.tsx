import React from "react";

import Card from "./sections/Card";
import Hero from "./sections/Hero";
import Intro from "./sections/Intro";
import Location from "./sections/Location";
import Value from "./sections/Value";

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
