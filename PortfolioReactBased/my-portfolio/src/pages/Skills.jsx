import { useState, useEffect } from 'react';
import { skills as skillsData } from '../data/skills';
import { ANIMATION_DELAYS } from '../utils/constants';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), ANIMATION_DELAYS.INITIAL);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen py-20">
      <br />
      <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#232946] bg-clip-text text-transparent animate-gradient">
            Skills & Technologies
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto px-6">
          {Array.isArray(skillsData) && skillsData.length > 0 ? skillsData.map((skill, index) => {
            if (!skill || !skill.id) return null;
            return (
            <div 
              key={skill.id} 
              className={`space-y-3 group transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>{skill.icon}</span>
                  {skill.name}
                </span>
                <span className="text-[#3be8b0] font-bold group-hover:scale-110 transition-transform duration-300">{skill.level}%</span>
              </div>
              <div className="h-4 bg-white/5 backdrop-blur-md rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors duration-300">
                <div 
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden group-hover:shadow-xl`}
                  style={{ 
                    width: isVisible ? `${skill.level}%` : '0%',
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
            </div>
            );
          }) : (
            <div className="col-span-2 text-center py-12 text-[#a5a6f6]">
              <p>No skills available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-8 text-center text-[#a5a6f6]">Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React', 'Vite', 'Python', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git'].map((tech, index) => (
              <div 
                key={`tech-${tech}-${index}`}
                className={`group bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 hover:border-cyan-300/40 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/10 text-center relative overflow-hidden focus-within:ring-2 focus-within:ring-cyan-300/50`}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1)' : 'scale(0.8)'
                }}
                role="listitem"
                tabIndex={0}
                aria-label={`${tech} technology`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/0 via-fuchsia-300/5 to-purple-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="font-semibold text-lg relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                  {tech}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
