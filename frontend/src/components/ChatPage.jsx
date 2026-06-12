import { useState, useRef, useEffect } from 'react'

const INJECTED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #07090f;
    overflow: hidden;
  }

  .chat-root {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    background: #07090f;
    color: #dde3ef;
    font-family: 'IBM Plex Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Dot-grid background */
  .chat-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none;
    z-index: 0;
  }

  /* Ambient glow blobs */
  .chat-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 10% 15%, rgba(34,211,160,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 50% 35% at 90% 80%, rgba(99,102,241,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* Scrollbar */
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 2px; }

  /* Textarea placeholder */
  .chat-textarea::placeholder {
    color: #2a3450;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Focus state for input wrapper */
  .input-wrapper:focus-within {
    border-color: rgba(99,102,241,0.3) !important;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.1), inset 0 0 20px rgba(99,102,241,0.02);
  }

  /* Message entrance animation */
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Typing dots */
  @keyframes blink {
    0%, 100% { opacity: 0.2; transform: scale(0.75); }
    50%       { opacity: 1;   transform: scale(1); }
  }

  /* Header scan line */
  @keyframes scanline {
    from { transform: translateX(-100%); }
    to   { transform: translateX(400%); }
  }

  /* Agent badge pulse on new message */
  @keyframes badgePop {
    0%   { transform: scale(0.85); opacity: 0; }
    60%  { transform: scale(1.06); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }

  .msg-enter { animation: msgIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
  .badge-pop { animation: badgePop 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }

  .send-btn:hover:not(:disabled) {
    background: rgba(99,102,241,0.3) !important;
    border-color: rgba(99,102,241,0.5) !important;
    box-shadow: 0 0 16px rgba(99,102,241,0.25);
  }

  .send-btn:active:not(:disabled) {
    transform: scale(0.93);
  }
`

const AGENTS = {
  health: {
    emoji: '🩺',
    label: 'HEALTH',
    sublabel: 'HealthInfo',
    color: '#22d3a0',
    dim: 'rgba(34,211,160,0.12)',
    border: 'rgba(34,211,160,0.22)',
  },
  graphic: {
    emoji: '🎨',
    label: 'GRAPHIC',
    sublabel: 'GraphicPro',
    color: '#c084fc',
    dim: 'rgba(192,132,252,0.12)',
    border: 'rgba(192,132,252,0.22)',
  },
  butterflies: {
    emoji: '🦋',
    label: 'BUTTERFLY',
    sublabel: 'ButterflyInfo',
    color: '#38bdf8',
    dim: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.22)',
  },
  poster: {
    emoji: '📰',
    label: 'POSTER',
    sublabel: 'PosterPro',
    color: '#fb923c',
    dim: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.22)',
  },
  unknown: {
    emoji: '◈',
    label: 'SYSTEM',
    sublabel: 'General',
    color: '#64748b',
    dim: 'rgba(100,116,139,0.1)',
    border: 'rgba(100,116,139,0.2)',
  },
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text, ts: Date.now(), id: crypto.randomUUID() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) throw new Error(`Server responded with ${res.status}`)

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: data.reply,
          source: (data.source || 'unknown').toLowerCase(),
          ts: Date.now(),
          id: crypto.randomUUID(),
        },
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 152) + 'px'
  }

  const canSend = input.trim().length > 0 && !loading

  return (
    <>
      <style>{INJECTED_STYLES}</style>

      <div className="chat-root">

        {/* ── Header ── */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '52px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          background: 'rgba(7,9,15,0.92)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 20,
          flexShrink: 0,
          gap: '16px',
        }}>
          {/* Scan-line accent */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '1px',
            width: '25%',
            background: 'linear-gradient(90deg, transparent, rgba(34,211,160,0.5), transparent)',
            animation: 'scanline 4s linear infinite',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Logo mark */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(34,211,160,0.1)',
              border: '1px solid rgba(34,211,160,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}>◈</div>

            <span style={{
              fontFamily: '"Syne", sans-serif',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: '#e2e8f0',
              textTransform: 'uppercase',
            }}>Multi-Agent AI</span>

            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#243050',
              letterSpacing: '0.08em',
            }}>// dispatch v2</span>
          </div>

          {/* Agent status pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {Object.entries(AGENTS).filter(([k]) => k !== 'unknown').map(([key, ag]) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: '3px',
                border: `1px solid ${ag.border}`,
                background: ag.dim,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: ag.color,
              }}>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: ag.color,
                  boxShadow: `0 0 5px ${ag.color}`,
                  flexShrink: 0,
                }} />
                {ag.label}
              </div>
            ))}
          </div>
        </header>

        {/* ── Messages ── */}
        <main className="chat-messages" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          position: 'relative',
          zIndex: 1,
        }}>

          {messages.length === 0 && !loading && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '80px 24px',
              textAlign: 'center',
              color: '#1e2a40',
            }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '52px',
                lineHeight: 1,
                opacity: 0.4,
              }}>◈</div>
              <p style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                letterSpacing: '0.12em',
                color: '#243050',
              }}>AWAITING QUERY DISPATCH</p>
              <p style={{
                fontSize: '13px',
                color: '#1a2236',
                lineHeight: 1.7,
                maxWidth: '360px',
              }}>
                Ask about health, graphic design, butterflies, or poster creation.
                Queries are classified and routed automatically.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['What are symptoms of dehydration?', 'Design a color palette for a sci-fi brand', 'Tell me about monarch butterflies'].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); textareaRef.current?.focus() }}
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '6px',
                      padding: '7px 13px',
                      color: '#334155',
                      fontSize: '11px',
                      fontFamily: '"JetBrains Mono", monospace',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.15)'
                      e.target.style.color = '#64748b'
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.target.style.color = '#334155'
                    }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="msg-enter" style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '10px',
            }}>
              {msg.role === 'ai' && <AgentMessage msg={msg} />}
              {msg.role === 'user' && <UserMessage msg={msg} />}
            </div>
          ))}

          {loading && (
            <div className="msg-enter" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(30,37,55,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#334155',
                flexShrink: 0,
              }}>◈</div>
              <div style={{
                padding: '13px 18px',
                background: 'rgba(14,18,30,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '2px solid #243050',
                borderRadius: '0 10px 10px 10px',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}>
                {[0, 0.18, 0.36].map((delay, i) => (
                  <span key={i} style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#2a3d5c',
                    display: 'inline-block',
                    animation: `blink 1.1s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="msg-enter" style={{
              alignSelf: 'center',
              maxWidth: '560px',
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(248,113,113,0.04)',
              border: '1px solid rgba(248,113,113,0.18)',
              borderRadius: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#94a3b8',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}>
              <span style={{ color: '#f87171' }}>ERR</span>
              <span style={{ color: '#334155' }}>//</span>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </main>

        {/* ── Input footer ── */}
        <footer style={{
          padding: '12px 24px 18px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(7,9,15,0.95)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 20,
          flexShrink: 0,
        }}>
          <div className="input-wrapper" style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            background: 'rgba(14,18,30,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            padding: '10px 12px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              color: '#243050',
              fontSize: '15px',
              lineHeight: '22px',
              userSelect: 'none',
              flexShrink: 0,
            }}>{'>'}</span>

            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={input}
              onChange={onInput}
              onKeyDown={onKeyDown}
              placeholder="Enter query for dispatch..."
              rows={1}
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#dde3ef',
                fontSize: '13.5px',
                fontFamily: '"JetBrains Mono", monospace',
                resize: 'none',
                lineHeight: '22px',
                maxHeight: '152px',
                overflowY: 'auto',
              }}
            />

            <button
              className="send-btn"
              onClick={send}
              disabled={!canSend}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '6px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.28)',
                color: canSend ? '#818cf8' : '#1e2535',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: canSend ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <p style={{
            marginTop: '7px',
            paddingLeft: '2px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: '#172030',
            letterSpacing: '0.06em',
          }}>
            Enter to send · Shift+Enter for newline
          </p>
        </footer>
      </div>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */

function AgentMessage({ msg }) {
  const agent = AGENTS[msg.source] || AGENTS.unknown

  return (
    <>
      {/* Avatar */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        background: agent.dim,
        border: `1px solid ${agent.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        flexShrink: 0,
        marginTop: '22px',
      }}>{agent.emoji}</div>

      <div style={{ maxWidth: 'min(72%, 680px)' }}>
        {/* Meta row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '5px',
        }}>
          <span className="badge-pop" style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: agent.color,
            padding: '2px 8px',
            borderRadius: '3px',
            border: `1px solid ${agent.border}`,
            background: agent.dim,
          }}>{agent.label}</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            color: '#1e2a3a',
            letterSpacing: '0.06em',
          }}>{fmtTime(msg.ts)}</span>
        </div>

        {/* Bubble */}
        <div style={{
          padding: '13px 16px',
          background: agent.dim,
          borderTop: `1px solid ${agent.border}`,
          borderRight: `1px solid ${agent.border}`,
          borderBottom: `1px solid ${agent.border}`,
          borderLeft: `2px solid ${agent.color}`,
          borderRadius: '0 10px 10px 10px',
        }}>
          <p style={{
            fontSize: '13.5px',
            lineHeight: 1.78,
            color: '#c8d3e8',
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontWeight: 300,
          }}>{msg.content}</p>
        </div>
      </div>
    </>
  )
}

function UserMessage({ msg }) {
  return (
    <>
      <div style={{ maxWidth: 'min(68%, 600px)' }}>
        {/* Meta row */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '5px',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            color: '#1e2a3a',
            letterSpacing: '0.06em',
          }}>{fmtTime(msg.ts)}</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            color: '#6366f1',
            padding: '2px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(99,102,241,0.28)',
            background: 'rgba(99,102,241,0.1)',
          }}>YOU</span>
        </div>

        {/* Bubble */}
        <div style={{
          padding: '13px 16px',
          background: 'rgba(99,102,241,0.09)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '10px 0 10px 10px',
        }}>
          <p style={{
            fontSize: '13.5px',
            lineHeight: 1.75,
            color: '#c7d2fe',
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 400,
          }}>{msg.content}</p>
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '8px',
        fontWeight: 700,
        color: '#6366f1',
        letterSpacing: '0.05em',
        flexShrink: 0,
        marginTop: '22px',
      }}>YOU</div>
    </>
  )
}
