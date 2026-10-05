import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Send, ArrowLeft, Bot, User, Loader, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const SUGGESTED_PROMPTS = [
  'What should I do on Day 1?',
  'Suggest a cheaper alternative for accommodation',
  'What to pack for this trip?',
  'What are the best local foods to try?',
  'Are there any safety tips for this destination?',
  'What is the best time to visit famous landmarks?',
]

/* ─── Message bubble ─── */
const MessageBubble = ({ msg, userInitial }) => {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 10,
      marginBottom: 18,
      animation: 'slideUp 0.3s ease both',
    }}>
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
          : 'linear-gradient(135deg,#06b6d4,#0891b2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isUser ? 13 : 16,
        fontWeight: 700, color: 'white',
        boxShadow: isUser ? '0 0 15px rgba(124,58,237,0.4)' : '0 0 15px rgba(6,182,212,0.4)',
      }}>
        {isUser ? (userInitial || <User size={15} />) : '✈️'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '70%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(79,70,229,0.4))'
          : 'rgba(255,255,255,0.08)',
        border: isUser
          ? '1px solid rgba(124,58,237,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        fontSize: 14,
        lineHeight: 1.7,
        color: 'white',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {!isUser && (
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#67e8f9',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            AI Travel Assistant
          </div>
        )}
        {msg.content || msg.message}
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.35)',
          marginTop: 6, textAlign: isUser ? 'left' : 'right',
        }}>
          {msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

/* ─── Typing indicator ─── */
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 18 }}>
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16,
    }}>✈️</div>
    <div style={{
      padding: '14px 20px', borderRadius: '18px 18px 18px 4px',
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', gap: 4, alignItems: 'center',
    }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#67e8f9',
          animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
        }} />
      ))}
    </div>
  </div>
)

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const ChatPage = () => {
  const { id }  = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [trip, setTrip]       = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  /* Load trip + chat history */
  useEffect(() => {
    Promise.all([
      api.get(`/trips/${id}`),
      api.get(`/ai/chat/${id}`).catch(() => ({ data: { messages: [] } })),
    ]).then(([tripRes, chatRes]) => {
      setTrip(tripRes.data?.trip || tripRes.data)
      const rawHistory = chatRes.data?.history || chatRes.data?.messages || chatRes.data || []
      // Normalize DB records: { role, message } → { role, content }
      const history = rawHistory.map(m => ({
        role: m.role,
        content: m.content || m.message || '',
        timestamp: m.createdAt || m.timestamp,
      }))
      if (history.length === 0) {
        // Welcome message
        setMessages([{
          role: 'assistant',
          content: `Hey there! ✈️ I'm your AI travel companion for your trip to ${tripRes.data?.trip?.destination || tripRes.data?.destination || 'your destination'}! 

I can help you with:
• Day-by-day activity suggestions
• Restaurant and food recommendations  
• Budget optimization tips
• Packing advice
• Local customs and safety tips

What would you like to know? 🌍`,
          timestamp: new Date().toISOString(),
        }])
      } else {
        setMessages(history)
      }
    }).catch(() => toast.error('Failed to load chat'))
      .finally(() => setLoading(false))
  }, [id])

  /* Auto-scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || sending) return
    setInput('')

    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setSending(true)

    try {
      const { data } = await api.post('/ai/chat', { tripId: id, message: msg })
      const aiMsg = {
        role: 'assistant',
        content: data?.reply || data?.message || data?.content || 'I\'m having trouble responding right now. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ I couldn\'t connect to the server. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) return <LoadingSpinner message="Loading your AI assistant..." />

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 70 }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: '#06b6d4', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }} />

      {/* ── CHAT CONTAINER ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        maxWidth: 800, width: '100%', margin: '0 auto',
        padding: '0 16px', height: '100%',
      }}>

        {/* Header */}
        <div style={{
          padding: '16px 0 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <button onClick={() => navigate(`/trips/${id}`)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4,
          }}>
            <ArrowLeft size={18} />
          </button>

          {/* AI avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg,#06b6d4,#0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 0 20px rgba(6,182,212,0.4)',
            position: 'relative',
          }}>
            ✈️
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 10, height: 10, borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0f0c29',
            }} />
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>AI Travel Assistant</div>
            <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>● Online · {trip?.destination || 'Your Trip'}</div>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Link to={`/trips/${id}/itinerary`} className="btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }}>
              View Itinerary
            </Link>
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex: 1, overflowY: 'auto', paddingTop: 20, paddingBottom: 10,
          scrollbarWidth: 'thin',
        }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} userInitial={userInitial} />
          ))}
          {sending && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* ── SUGGESTED PROMPTS ── */}
        {messages.length <= 1 && (
          <div style={{ paddingBottom: 12, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Suggested questions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  disabled={sending}
                  style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── INPUT AREA ── */}
        <div style={{
          padding: '12px 0 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16, padding: '8px 8px 8px 16px',
            transition: 'border-color 0.2s ease',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your trip... (Enter to send)"
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'white', fontSize: 14, fontFamily: 'Inter, sans-serif',
                resize: 'none', lineHeight: 1.6, maxHeight: 120, overflowY: 'auto',
                alignSelf: 'center',
              }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: input.trim() && !sending
                  ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                  : 'rgba(255,255,255,0.06)',
                border: 'none', cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', transition: 'all 0.2s ease',
                boxShadow: input.trim() && !sending ? '0 4px 15px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {sending
                ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                : <Send size={16} />
              }
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
            Press <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 4 }}>Enter</kbd> to send · <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 4 }}>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
