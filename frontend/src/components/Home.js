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

      <div className="subject-sections">        
        <section className="subject-section math-section">
          <div className="subject-content">
            <h2>গণিত</h2>
            <p>সংখ্যা, আকার ও প্যাটার্নের বিস্ময়কর জগতে প্রবেশ করো। গণিতের সৌন্দর্য ও বাস্তব জীবনের সমস্যার সমাধানে এর প্রয়োগ সম্পর্কে জানো ও শিখো।</p>
            <Link to="/math" className="subject-btn">Go to Math Page</Link>
          </div>
          <div className="subject-video">
            <video muted autoPlay loop>
              <source src={process.env.PUBLIC_URL + "/videos/math-video.webm"} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <section className="subject-section physics-section">
          <div className="subject-content">
            <h2>পদার্থবিজ্ঞান</h2>
            <p>বিশ্বের পরিচালনাকারী মৌলিক নিয়মগুলো আবিষ্কার করো। গতিবিদ্যা, শক্তি, বল এবং বস্তুর গঠন সম্পর্কে জানো ইন্টারঅ্যাকটিভ এক্সপেরিমেন্ট ও সিমুলেশনের মাধ্যমে।</p>
            <Link to="/physics" className="subject-btn">Go to Physics Page</Link>
          </div>
          <div className="subject-video">
            <video muted autoPlay loop>
              <source src={process.env.PUBLIC_URL + "/videos/phy-video.mp4"} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
        
        <section className="subject-section chemistry-section">
          <div className="subject-content">
            <h2>রসায়ন</h2>
            <p>উপাদান, যৌগ এবং রাসায়নিক বিক্রিয়া সম্পর্কে জানো, যা আমাদের চারপাশের জগতকে গঠিত করে। পরমাণুর গঠন, রাসায়নিক বন্ধন এবং বস্তুদের চমকপ্রদ মিথস্ক্রিয়া অন্বেষণ করো।</p>
            <Link to="/chemistry" className="subject-btn">Go to Chemistry Page</Link>
          </div>
            <div className="subject-video">
            <video muted autoPlay loop>
              <source src={process.env.PUBLIC_URL + "/videos/chem-video.mp4"} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </div>
      <footer
        style={{
          backgroundColor: '#1c1c1c',
          color: '#ffffff',
          textAlign: 'center',
          padding: '1rem 0',
          fontSize: '1.5rem',
          marginTop: '2rem',
          fontWeight: 'bold',
          borderTop: '1px solid #444',
        }}
      >
        <p style={{ margin: 0 }}>Developed by Team DU_AVOCADO</p>
      </footer>

    </div>
    
  );
};

export default Home;
