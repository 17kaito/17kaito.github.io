import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { experiences, education, currentCoursework } from '../data/content'
import type { HeroAPI } from '../three/hero'

export default function Home() {
  const threeRootRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HeroAPI | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let cleanup: (() => void) | undefined
    const el = threeRootRef.current
    if (!el) return
    // lazy-load three hero
    import('../three/hero').then(m => {
      apiRef.current = m.mountThree(el)
      cleanup = apiRef.current.cleanup
    })
    return () => { cleanup?.() }
  }, [])

  // Handle scrolling when navigating from projects page
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo
      const element = document.getElementById(sectionId)
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }, 100)
      }
    }
  }, [location.state])

  const goProjects = async () => {
    await apiRef.current?.warpOut()
    navigate('/projects')
  }

  return (
    <>
      {/* Hero - Full Screen */}
      <section id="mission" className="relative h-screen grid place-items-center overflow-hidden">
        {/* 
          ADJUST 3D POSITIONING HERE:
          - Add CSS transform to move 3D scene up/down: style={{ transform: 'translateY(-10vh)' }}
          - Or adjust STAGE_Y and FRAME_OFFSET in hero.ts for more precise control
        */}
        <div ref={threeRootRef} className="absolute inset-0" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-slate-200 drop-shadow-lg leading-tight">Hi there! I'm Kite Ogawa.</h1>
          <p className="text-slate-200 mt-6 text-base sm:text-lg">I like building software to interface physical systems.</p>
          <button onClick={goProjects} className="inline-block mt-8 px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 text-slate-200 hover:bg-neutral-800 transition-colors">
            See Projects
          </button>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-slate-200 text-3xl mb-8 drop-shadow-lg">Work Experience</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((e, idx) => (
            <article key={idx} className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Logo section at top */}
              <div className="flex justify-center py-2 bg-neutral-800">
                {e.logoUrl ? (
                  <div className="h-20 w-20 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
                    <img 
                      src={e.logoUrl} 
                      alt={e.company} 
                      className={`h-full w-full rounded-full ${
                        e.company === "UCLA Formula SAE" ? "object-contain" : "object-cover"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full flex items-center justify-center text-neutral-300 font-bold text-2xl bg-neutral-700">
                    {e.company.charAt(0)}
                  </div>
                )}
              </div>

              {/* Company name below logo */}
              <div className="py-1 bg-neutral-800">
                <h5 className="text-white font-semibold text-lg text-center">{e.company}</h5>
              </div>

              {/* Content section */}
              <div className="p-6 bg-neutral-900">
                <h3 className="text-slate-200 font-semibold text-lg mb-2 drop-shadow-md">{e.title}</h3>
                <div className="text-neutral-400 text-sm mb-4 font-medium">{e.date}</div>
                <ul className="space-y-2 text-neutral-300 text-sm leading-relaxed">
                  {e.points.map((p, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-slate-200 mr-2 mt-1.5 drop-shadow-sm">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Education */}
      <section id="education" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-slate-200 text-3xl mb-8 drop-shadow-lg">Education</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Education Card */}
          <div className="lg:col-span-2 space-y-6">
            {education.map((edu, idx) => (
              <article key={idx} className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg p-6">
                <div className="flex items-start gap-4">
                  {edu.logoUrl ? (
                    <div className="h-16 w-16 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={edu.logoUrl} 
                        alt={edu.institution} 
                        className="h-full w-full object-contain rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full flex items-center justify-center text-neutral-300 font-bold text-xl bg-neutral-700 flex-shrink-0">
                      {edu.institution.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-xl mb-2">{edu.institution}</h3>
                    <div className="text-slate-200 font-medium text-lg mb-1 drop-shadow-md">{edu.degree}</div>
                    <div className="text-neutral-400 text-sm mb-3">{edu.years} • {edu.gpa}</div>
                    <ul className="space-y-1 text-neutral-300 text-sm">
                      {edu.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-slate-200 mr-2 mt-1 drop-shadow-sm">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Current Coursework Card */}
          <div className="lg:col-span-1">
            <article className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg p-6 h-full">
              <h3 className="text-white font-semibold text-lg mb-4">Current Coursework</h3>
              <ul className="space-y-2 text-neutral-300 text-sm">
                {currentCoursework.map((course, i) => (
                  <li key={i} className="flex items-start">
                                            <span className="text-slate-200 mr-2 mt-1 drop-shadow-sm">•</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-14 text-center">
        <h2 className="text-slate-200 text-3xl mb-3 drop-shadow-lg">Contact</h2>
        <p className="text-neutral-300">kiteogawa1@g.ucla.edu • 248-321-4350</p>
        <a className="inline-block mt-3 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-200" href="mailto:kiteogawa1@g.ucla.edu">Email me</a>
      </section>
    </>
  )
}


