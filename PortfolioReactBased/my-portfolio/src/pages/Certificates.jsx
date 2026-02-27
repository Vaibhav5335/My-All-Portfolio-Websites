import { useState, useEffect } from 'react';
import { ANIMATION_DELAYS } from '../utils/constants';
import Stack from '../components/Stack';
import { certificates as certificatesData } from '../data/certificates';

const Certificates = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), ANIMATION_DELAYS.INITIAL);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-12">
      <br />
      <div className={`flex-1 flex flex-col justify-center transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#232946] bg-clip-text text-transparent animate-gradient">
            My Certificates
          </span>
        </h2>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-center text-[#a5a6f6] text-base md:text-lg mb-8">
              Here are my professional certifications and achievements
            </p>
          </div>
          
          <div className="flex justify-center items-center mt-8">
            {Array.isArray(certificatesData) && certificatesData.length > 0 ? (
              <Stack
                cardDimensions={{ width: 600, height: 440 }}
                sensitivity={150}
                sendToBackOnClick={true}
                randomRotation={true}
                cardsData={certificatesData}
                animationConfig={{ stiffness: 280, damping: 25 }}
              />
            ) : (
              <div className="text-center text-[#a5a6f6] py-8">
                <p>No certificates available at the moment.</p>
              </div>
            )}
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Certificates;

