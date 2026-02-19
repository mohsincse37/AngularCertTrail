import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CustomCss.css';
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section 
            className="hero-section position-relative d-flex align-items-center justify-content-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '40vh',
            }}
        >
            {/* Shadow overlay with gradient */}
            <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8))',
                }}
            ></div>

            {/* Content */}
            <div className="position-relative z-10 text-center text-white text-section">
                <h1 
                    className="display-4 display-md-3 fw-bold mb-4 text-uppercase"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                    Subscription Certification Topic
                </h1>
                <div className="d-flex justify-content-center gap-3">
                    <Link 
                          to="/home" 
                          className="btn btn-primary text-white px-4 py-2 rounded-pill fw-bold"
                          style={{transition: 'background-color 0.3s' }}
                      >
                          Free Dumps Practice
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;