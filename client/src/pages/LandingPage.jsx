import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, Map, Wallet, MessageCircle, ChevronRight,
  Globe, Star, Zap, Shield, ArrowRight, Plane,
} from 'lucide-react'

/* ── Animated background orbs ── */
const Orb = ({ style }) => (
  <div style={{
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.35,
    pointerEvents: 'none',
    ...style,
  }} />
)

const FeatureCard = ({ icon, title, desc, delay, color }) => (
  <div
    className="glass-card"
    style={{
      padding: 32,
      textAlign: 'center',
      animation: `slideUp 0.7s ease ${delay}s both`,
      cursor: 'default',
    }}
  >
    <div style={{
      width: 64, height: 64,
      borderRadius: 18,
      background: `linear-gradient(135deg, ${color}33, ${color}11)`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: 28,
      boxShadow: `0 0 30px ${color}22`,
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'white' }}>{title}</h3>
    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
  </div>
)

const StepCard = ({ number, title, desc, delay }) => (
  <div style={{
    display: 'flex', gap: 20, alignItems: 'flex-start',
    animation: `slideInLeft 0.6s ease ${delay}s both`,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 18, color: 'white',
      boxShadow: '0 0 25px rgba(124,58,237,0.5)',
    }}>
      {number}
    </div>
    <div>
      <h4 style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  </div>
)

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center', padding: '20px 32px' }}>
    <div style={{
      fontSize: 38, fontWeight: 900,
      background: 'linear-gradient(135deg,#a78bfa,#67e8f9)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      marginBottom: 4,
    }}>
      {value}
    </div>
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</div>
  </div>
)

const LandingPage = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <Orb style={{ width: 600, height: 600, background: '#7c3aed', top: -100, left: -200 }} />
      <Orb style={{ width: 500, height: 500, background: '#06b6d4', top: 200, right: -150 }} />
      <Orb style={{ width: 400, height: 400, background: '#4f46e5', bottom: 200, left: '30%' }} />

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 30,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.35)',
          marginBottom: 32,
          animation: 'slideUp 0.5s ease 0.1s both',
        }}>
          <Sparkles size={14} color="#a78bfa" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>
            Powered by Artificial Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-2px',
          marginBottom: 24,
          animation: 'slideUp 0.6s ease 0.2s both',
          maxWidth: 900,
        }}>
          Plan Your{' '}
          <span className="gradient-text">Dream Trip</span>
          <br />with AI Magic ✨
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 600,
          lineHeight: 1.75,
          marginBottom: 44,
          animation: 'slideUp 0.6s ease 0.3s both',
        }}>
          Describe your dream destination and let our AI craft a personalized itinerary,
          track your budget, and be your travel companion — all in one place.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'slideUp 0.6s ease 0.4s both',
        }}>
          <Link to="/register" className="btn-primary" style={{
            padding: '15px 36px', fontSize: 16,
            boxShadow: '0 10px 30px rgba(124,58,237,0.5)',
          }}>
            <Plane size={18} /> Start Planning Free
          </Link>
          <a href="#features" className="btn-secondary" style={{ padding: '15px 36px', fontSize: 16 }}>
            Learn More <ChevronRight size={18} />
          </a>
        </div>

        {/* Floating plane */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          fontSize: 80, animation: 'float 7s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.7))',
          pointerEvents: 'none',
        }}>
          ✈️
        </div>
        <div style={{
          position: 'absolute', bottom: '18%', left: '6%',
          fontSize: 50, animation: 'float 9s ease-in-out 2s infinite',
          filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.5))',
          pointerEvents: 'none',
        }}>
          🌍
        </div>
        <div style={{
          position: 'absolute', top: '30%', left: '5%',
          fontSize: 40, animation: 'float 8s ease-in-out 1s infinite',
          pointerEvents: 'none',
        }}>
          🗺️
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'bounce 2s ease-in-out infinite',
          color: 'rgba(255,255,255,0.4)', fontSize: 12,
        }}>
          <div style={{
            width: 24, height: 40, border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6,
          }}>
            <div style={{
              width: 4, height: 8, borderRadius: 2,
              background: 'rgba(255,255,255,0.5)',
              animation: 'slideUp 1.5s ease-in-out infinite',
            }} />
          </div>
          Scroll to explore
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <StatItem value="50K+" label="Trips Planned" />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />
          <StatItem value="120+" label="Destinations" />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />
          <StatItem value="4.9★" label="User Rating" />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />
          <StatItem value="99%" label="AI Accuracy" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 30,
              background: 'rgba(6,182,212,0.12)',
              border: '1px solid rgba(6,182,212,0.3)',
              marginBottom: 20,
            }}>
              <Zap size={13} color="#67e8f9" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#67e8f9', letterSpacing: '0.08em' }}>
                CORE FEATURES
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
              letterSpacing: '-1px', marginBottom: 16,
            }}>
              Everything you need to travel{' '}
              <span className="gradient-text">smarter</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              From AI-powered itineraries to real-time budget tracking — Trippy has it all.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            <FeatureCard
              delay={0}
              color="#7c3aed"
              icon="🤖"
              title="AI-Powered Itineraries"
              desc="Describe your dream trip and our AI generates a complete day-by-day itinerary tailored to your preferences, budget, and travel style."
            />
            <FeatureCard
              delay={0.1}
              color="#06b6d4"
              icon="💰"
              title="Smart Budget Tracker"
              desc="Track every expense in real-time with category breakdowns, visual progress bars, and smart spending alerts to keep you on budget."
            />
            <FeatureCard
              delay={0.2}
              color="#ec4899"
              icon="💬"
              title="AI Travel Companion"
              desc="Chat with your AI assistant anytime during your trip. Get recommendations, alternative suggestions, packing tips, and local insights."
            />
            <FeatureCard
              delay={0.3}
              color="#f59e0b"
              icon="✈️"
              title="Flight Search"
              desc="Search and compare flights instantly. Get the best deals for your travel dates and seamlessly add them to your trip plan."
            />
            <FeatureCard
              delay={0.4}
              color="#10b981"
              icon="🗺️"
              title="Place Discovery"
              desc="Explore top attractions, hidden gems, local restaurants, and experiences at your destination, curated just for your interests."
            />
            <FeatureCard
              delay={0.5}
              color="#8b5cf6"
              icon="🌟"
              title="Travel Highlights"
              desc="Automatically capture and organize your trip highlights, packing lists, and travel tips for a seamless journey from start to finish."
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 14 }}>
              Plan in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16 }}>
              From idea to itinerary in minutes, not hours.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40,
            maxWidth: 900, margin: '0 auto',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <StepCard
                number="1"
                delay={0}
                title="Tell us your dream destination"
                desc="Enter where you want to go, your travel dates, the number of travelers, and your budget. Our smart form guides you through everything."
              />
              <StepCard
                number="2"
                delay={0.15}
                title="Set your preferences"
                desc="Choose your interests — beach, mountains, history, food, adventure. Pick your travel style and accommodation type for a truly personalized plan."
              />
              <StepCard
                number="3"
                delay={0.3}
                title="Get your AI-crafted itinerary"
                desc="Instantly receive a beautiful day-by-day itinerary with activities, meals, costs, and tips. Chat with AI to refine it anytime."
              />
            </div>

            {/* Decorative card preview */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glass-card" style={{ padding: 28, width: '100%', maxWidth: 340 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                  }}>🌸</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Tokyo, Japan</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>7 Days · 2 Travelers</div>
                  </div>
                </div>
                {['Day 1 · Shinjuku & Harajuku', 'Day 2 · Asakusa Temple', 'Day 3 · Mt. Fuji Day Trip'].map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: i === 0 ? '#7c3aed' : i === 1 ? '#06b6d4' : '#ec4899',
                    }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{d}</span>
                    <ChevronRight size={14} color="rgba(255,255,255,0.3)" style={{ marginLeft: 'auto' }} />
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>BUDGET ESTIMATE</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>₹85,000 <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>/ 7 days</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="section">
        <div className="container">
          <div style={{
            borderRadius: 28,
            padding: '64px 40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2), rgba(6,182,212,0.15))',
            border: '1px solid rgba(124,58,237,0.3)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(124,58,237,0.2)', filter: 'blur(60px)',
            }} />
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>
              Ready to explore the world?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
              Join thousands of travelers who plan smarter with Trippy. It's free to get started.
            </p>
            <Link to="/register" className="btn-primary" style={{
              padding: '16px 40px', fontSize: 17,
              boxShadow: '0 12px 35px rgba(124,58,237,0.6)',
            }}>
              Start Your Adventure <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '36px 24px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>✈️</span>
          <span style={{
            fontSize: 18, fontWeight: 800,
            background: 'linear-gradient(135deg,#a78bfa,#67e8f9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Trippy
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          © {new Date().getFullYear()} Trippy. All rights reserved. Built with ❤️ for travelers.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
