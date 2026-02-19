import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    
    
    return (
        <footer className="bg-dark text-white py-4">
            <div className="container">
                {/* Social Media and Copyright */}
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <p className="mb-0 text-light">
                            &copy; {new Date().getFullYear()} CertificateDumps. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <a href="https://facebook.com" className="text-white me-3" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" className="text-white me-3" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;