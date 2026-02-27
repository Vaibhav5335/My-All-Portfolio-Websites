import { useState, useEffect } from 'react';
import { ANIMATION_DELAYS } from '../utils/constants';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), ANIMATION_DELAYS.INITIAL);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-16">
      <br />
      <div className={`flex-1 flex flex-col justify-center transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        <div className="max-w-6xl mx-auto px-6 mb-6 md:mb-8">
          <div className="text-center mb-2">
            <h2 className="text-4xl md:text-6xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#3be8b0] bg-clip-text text-transparent animate-gradient">
                About Me
              </span>
            </h2>
            <p className="text-[#a5a6f6]/70 text-sm md:text-base font-light">Crafting digital experiences with passion and precision</p>
          </div>
        </div>
        
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-7xl mx-auto px-6 mb-16 md:mb-24">
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'} h-full`}>
            <div className="relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3be8b0]/20 via-[#a5a6f6]/20 to-[#3be8b0]/20 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 h-full flex flex-col justify-center">
                <div className="space-y-4 text-[#a5a6f6] text-sm md:text-base leading-relaxed">
                  <p className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    I'm a passionate <span className="text-[#3be8b0] font-semibold">full-stack developer</span> with a keen eye for design and a love for creating seamless user experiences.
                  </p>
                  <p className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    With expertise spanning from <span className="text-cyan-300 font-semibold">React</span> to <span className="text-fuchsia-300 font-semibold">Python</span>, I bridge the gap between beautiful interfaces and powerful backend systems. My journey in tech started with curiosity, which evolved into building innovative solutions.
                  </p>
                  <p className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    I specialize in modern web technologies and love staying ahead of the curve with emerging trends, contributing to open-source projects, and exploring new frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'} h-full`}>
            <div className="flex flex-col gap-4 h-full justify-center">
              <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-cyan-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/20 transform hover:-translate-y-2 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-300/80 to-cyan-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-cyan-400/30 flex-shrink-0">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-300 mb-2">Experience</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">1+ years building web applications and leading development teams</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-fuchsia-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-400/20 transform hover:-translate-y-2 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-300/80 to-fuchsia-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-fuchsia-400/30 flex-shrink-0">
                    <span className="text-white text-xl">💼</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-fuchsia-300 mb-2">Projects</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">10+ successful projects delivered across various industries</p>
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-400/20 transform hover:-translate-y-2 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-300/80 to-purple-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-400/30 flex-shrink-0">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-300 mb-2">Technologies</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">Expert in React, Python, Node.js, and modern web stack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-12 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#a5a6f6] to-transparent mx-auto rounded-full"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#3be8b0] bg-clip-text text-transparent animate-gradient">
                Educational Journey
              </span>
            </h2>
            <p className="text-[#a5a6f6]/70 text-sm md:text-base font-light">My academic path and aspirations</p>
          </div>

          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10">
            
            <div className={`transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-cyan-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-400/20 transform hover:-translate-y-2 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col md:flex-row gap-5 items-center md:items-start">
                  <div className="flex-shrink-0 w-full md:w-1/2 overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 shadow-lg flex items-center justify-center">
                    <div className="w-full h-48 md:h-56 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-cyan-600/20">
                      <span className="text-6xl" aria-hidden="true">🏫</span>
                      <span className="sr-only">School image placeholder</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full md:w-1/2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-300/80 to-cyan-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-cyan-400/30">
                        <span className="text-white text-xl">🏫</span>
                      </div>
                      <h3 className="text-xl font-bold text-cyan-300">School</h3>
                    </div>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p className="font-semibold text-cyan-300 text-base">High School</p>
                      <p className="leading-relaxed">Completed with excellent academic performance</p>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">Foundation of my learning journey</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className={`transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-fuchsia-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-400/20 transform hover:-translate-y-2 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col md:flex-row gap-5 items-center md:items-start">
                  <div className="flex-shrink-0 w-full md:w-1/2 overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-400/20 to-fuchsia-600/20 shadow-lg flex items-center justify-center">
                    <div className="w-full h-48 md:h-56 flex items-center justify-center bg-gradient-to-br from-fuchsia-400/20 to-fuchsia-600/20">
                      <span className="text-6xl" aria-hidden="true">🎓</span>
                      <span className="sr-only">College image placeholder</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full md:w-1/2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-300/80 to-fuchsia-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-fuchsia-400/30">
                        <span className="text-white text-xl">🎓</span>
                      </div>
                      <h3 className="text-xl font-bold text-fuchsia-300">College</h3>
                    </div>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p className="font-semibold text-fuchsia-300 text-base">B.Tech CSE (AI & DS)</p>
                      <p className="leading-relaxed">Bachelor of Technology in Computer Science Engineering</p>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">Specialization: Artificial Intelligence & Data Science</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} w-full`}>
            <div className="group relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-300/50 hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-400/20 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-300/80 to-purple-400/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-purple-300">Future Plans</h3>
                </div>
                <div className="space-y-3 text-gray-300 text-sm">
                  <p className="font-semibold text-purple-300 text-base">Career Goals</p>
                  <p className="leading-relaxed">Pursuing excellence in AI/ML and full-stack development</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">Building innovative solutions and contributing to tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
