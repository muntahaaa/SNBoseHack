import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <section className="hero-section">
        <video className="hero-video" autoPlay muted loop>
          <source src={process.env.PUBLIC_URL + "/videos/cover.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
       
      </section>

      <div className="subject-sections">        <section className="subject-section math-section">
          <div className="subject-content">
            <h2>Mathematics</h2>
            <p>Explore the fascinating world of numbers, shapes, and patterns. Discover the beauty of mathematical concepts and their applications in solving real-world problems.</p>
            <Link to="/math" className="subject-btn">Go to Math Page</Link>
          </div>
          <div className="subject-video">
            <video muted autoPlay loop>
              <source src={process.env.PUBLIC_URL + "/videos/math-video.webm"} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
          <section className="subject-section physics-section" 
                 style={{backgroundImage: `url(${process.env.PUBLIC_URL + "/images/physics-cover.jpg"})`, 
                         backgroundSize: 'cover', 
                         backgroundPosition: 'center'}}>
          <div className="subject-content">
            <h2>Physics</h2>
            <p>Discover the fundamental laws that govern the universe. Explore motion, energy, forces, and the building blocks of matter through interactive experiments and simulations.</p>
            <Link to="/physics" className="subject-btn">Go to Physics Page</Link>
          </div>
        </section>        <section className="subject-section chemistry-section">
          <div className="subject-content">
            <h2>Chemistry</h2>
            <p>Learn about elements, compounds, and chemical reactions that shape our world. Explore atomic structure, chemical bonding, and the fascinating interactions of matter.</p>
            <Link to="/chemistry" className="subject-btn">Go to Chemistry Page</Link>
          </div>
          <div className="subject-image">
            <img 
              src={process.env.PUBLIC_URL + "/images/chemistry-cover.png"} 
              alt="Chemistry" 
              className="chemistry-cover-image" 
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
