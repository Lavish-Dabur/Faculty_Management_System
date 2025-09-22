import react from "react";
import { useState } from "react";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import './Home.css'
import Analytics from "./Analytics";
 export default function Home(){

        return (
            <div className="home-container">
                <Hero />
                <Features />
                <Analytics/>
                <Footer/>
            </div>
        )
}