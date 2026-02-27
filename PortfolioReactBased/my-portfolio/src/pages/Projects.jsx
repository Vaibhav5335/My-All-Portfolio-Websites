import { useState, useEffect, useCallback } from 'react';
import { projects as projectsData } from '../data/projects';
import { ANIMATION_DELAYS } from '../utils/constants';
import { validateImageUrl, logError } from '../utils/validation';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), ANIMATION_DELAYS.INITIAL);
    return () => clearTimeout(timer);
  }, []);

  const handleImageError = useCallback((projectId) => {
    if (projectId) {
      setImageErrors(prev => ({ ...prev, [projectId]: true }));
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV && Array.isArray(projectsData) && projectsData.length > 0) {
      const invalidProjects = projectsData
        .filter(project => project && project.image && !validateImageUrl(project.image))
        .map(project => project.id);
      
      if (invalidProjects.length > 0) {
        invalidProjects.forEach(projectId => {
          logError(new Error(`Invalid image URL for project ${projectId}`), 'Projects image validation');
        });
        setImageErrors(prev => {
          const newErrors = { ...prev };
          invalidProjects.forEach(id => {
            newErrors[id] = true;
          });
          return newErrors;
        });
      }
    }
  }, []);

  
  const safeProjects = Array.isArray(projectsData) ? projectsData.filter(p => p && p.id) : [];

  return (
    <div className="min-h-screen py-20">
      <br />
      <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h2 className="text-5xl md:text-6xl font-bold mb-12 text-center">
          <span className="bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#232946] bg-clip-text text-transparent animate-gradient">
            Featured Projects
          </span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
          {safeProjects.length > 0 ? safeProjects.map((project, index) => (
            <article 
              key={project.id} 
              className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative"
              style={{ 
                transitionDelay: `${index * 150}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              {project.gradient && (
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              )}
              
              <div className="aspect-video overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900">
                {!imageErrors[project.id] && project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title ? `${project.title} project screenshot` : 'Project screenshot'}
                    loading="lazy"
                    onError={() => handleImageError(project?.id)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900" role="img" aria-label="Project image placeholder">
                    <span className="sr-only">Image not available</span>
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 relative z-10">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#3be8b0] transition-colors duration-300">
                  {project.title || 'Untitled Project'}
                </h3>
                <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                  {project.description || 'No description available.'}
                </p>
                
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label={project.title ? `Technologies used in ${project.title}` : 'Technologies used'}>
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={`${project.id}-${tag}-${tagIndex}`} 
                        role="listitem"
                        className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/10 group-hover:bg-white/20 group-hover:border-white/20 transition-all duration-300 transform group-hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3">
                  {project.demo && typeof project.demo === 'string' && project.demo.trim() !== '' ? (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#3be8b0] text-black rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-offset-2 focus:ring-offset-gray-900"
                      aria-label={project.title ? `View ${project.title} live demo` : 'View live demo'}
                    >
                      Live Demo
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed opacity-50"
                      aria-label="Live demo not available"
                    >
                      Live Demo
                    </button>
                  )}
                  {project.github && typeof project.github === 'string' && project.github.trim() !== '' ? (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-gray-900"
                      aria-label={project.title ? `View ${project.title} on GitHub` : 'View on GitHub'}
                    >
                      GitHub
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg cursor-not-allowed opacity-50"
                      aria-label="GitHub repository not available"
                    >
                      GitHub
                    </button>
                  )}
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-2 text-center py-12 text-[#a5a6f6]">
              <p>No projects available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
          <div className={`transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-3xl font-bold mb-8 text-[#a5a6f6]">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: 'Total Projects', value: '12+' },
                { label: 'Technologies Used', value: '8+' },
                { label: 'Happy Clients', value: '25+' },
                { label: 'Lines of Code', value: '50K+' }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 transform transition-all duration-500 hover:scale-105 hover:border-cyan-300/40"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl font-bold text-[#3be8b0] mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
