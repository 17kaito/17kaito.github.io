import { projects } from '../data/content'
import { Link } from 'react-router-dom'

export default function Projects() {
  return (
    <div className="min-h-screen bg-black">
      {/* Back to Home Button */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-slate-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-slate-200 text-5xl font-bold drop-shadow-lg">Projects</h1>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="space-y-8">
          {projects.map((project, idx) => (
            <article key={idx} className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Project Header */}
              <div className="p-6 bg-neutral-800 border-b border-neutral-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-white font-semibold text-2xl mb-2">{project.name}</h2>
                    <div className="text-neutral-400 text-sm font-medium">{project.date}</div>
                  </div>
                  <div className="flex gap-3">
                    {/* {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-slate-200 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                      >
                        <img src="public/github_logo.png" alt="GitHub" className="w-5 h-5" />
                        <span className="text-black">GitHub</span>
                      </a>
                    )} */}

                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Description */}
                  <div className="lg:col-span-2">
                    <p className="text-neutral-300 text-base leading-relaxed mb-6">{project.blurb}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="lg:col-span-1">
                    {project.imageUrl && (
                      <div className="rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 mb-4">
                        <img 
                          src={project.imageUrl} 
                          alt={`${project.name} screenshot`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    {project.videoUrl && (
                      <div className="rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
                        <video 
                          controls 
                          className="w-full h-48 object-cover"
                          poster={project.imageUrl}
                        >
                          <source src={project.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}


