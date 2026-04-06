import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Key, House, Search, ChevronLeft } from 'lucide-react'

const PRIMARY = '#FF1351'
const DARK = '#1a1a2e'
const GAME_W = 420
const GAME_H = 520
const PADDLE_W = 80
const PADDLE_H = 16
const KEY_SIZE = 30
const SPAWN_INTERVAL = 900
const FALL_SPEED = 2.5

const EMOJIS = ['🔑', '🏠', '🛋️', '🏡']
const BOMB_EMOJI = '💣'

export default function NotFound() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const gameRef = useRef({
    paddleX: GAME_W / 2 - PADDLE_W / 2,
    items: [],
    score: 0,
    lives: 3,
    frame: 0,
    running: false,
    highScore: parseInt(localStorage.getItem('fm_404_high') || '0'),
    gameOver: false,
  })
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(gameRef.current.highScore)
  const [started, setStarted] = useState(false)
  const animRef = useRef(null)

  const startGame = useCallback(() => {
    const g = gameRef.current
    g.paddleX = GAME_W / 2 - PADDLE_W / 2
    g.items = []
    g.score = 0
    g.lives = 3
    g.frame = 0
    g.running = true
    g.gameOver = false
    setScore(0)
    setLives(3)
    setGameOver(false)
    setStarted(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleMove = (clientX) => {
      const rect = canvas.getBoundingClientRect()
      gameRef.current.paddleX = Math.max(0, Math.min(GAME_W - PADDLE_W, clientX - rect.left - PADDLE_W / 2))
    }
    const onMouse = (e) => handleMove(e.clientX)
    const onTouch = (e) => { e.preventDefault(); handleMove(e.touches[0].clientX) }
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('touchmove', onTouch, { passive: false })
    return () => { canvas.removeEventListener('mousemove', onMouse); canvas.removeEventListener('touchmove', onTouch) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const loop = () => {
      const g = gameRef.current
      if (!g.running) { animRef.current = requestAnimationFrame(loop); return }
      g.frame++

      if (g.frame % Math.max(20, Math.round(SPAWN_INTERVAL / (16 + g.score * 0.3))) === 0) {
        const isBomb = Math.random() < 0.25
        g.items.push({
          x: Math.random() * (GAME_W - KEY_SIZE), y: -KEY_SIZE,
          type: isBomb ? 'bomb' : 'key',
          emoji: isBomb ? BOMB_EMOJI : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          speed: FALL_SPEED + Math.random() * 1.2 + g.score * 0.02,
        })
      }

      for (let i = g.items.length - 1; i >= 0; i--) {
        const item = g.items[i]
        item.y += item.speed
        const catching = item.y + KEY_SIZE >= GAME_H - PADDLE_H - 10 && item.y + KEY_SIZE <= GAME_H && item.x + KEY_SIZE > g.paddleX && item.x < g.paddleX + PADDLE_W
        if (catching) {
          if (item.type === 'bomb') {
            g.lives--; setLives(g.lives)
            if (g.lives <= 0) { g.running = false; g.gameOver = true; if (g.score > g.highScore) { g.highScore = g.score; localStorage.setItem('fm_404_high', String(g.score)); setHighScore(g.score) } setGameOver(true) }
          } else { g.score++; setScore(g.score) }
          g.items.splice(i, 1); continue
        }
        if (item.y > GAME_H + 10) {
          if (item.type === 'key') {
            g.lives--; setLives(g.lives)
            if (g.lives <= 0) { g.running = false; g.gameOver = true; if (g.score > g.highScore) { g.highScore = g.score; localStorage.setItem('fm_404_high', String(g.score)); setHighScore(g.score) } setGameOver(true) }
          }
          g.items.splice(i, 1)
        }
      }

      ctx.clearRect(0, 0, GAME_W, GAME_H)
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, GAME_W, GAME_H)

      ctx.fillStyle = '#f1f5f9'
      for (let x = 20; x < GAME_W; x += 30) {
        for (let y = 20; y < GAME_H; y += 30) {
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill()
        }
      }

      ctx.font = `${KEY_SIZE}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      g.items.forEach(item => {
        ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4
        ctx.fillText(item.emoji, item.x + KEY_SIZE / 2, item.y + KEY_SIZE / 2)
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0
      })

      ctx.fillStyle = PRIMARY; ctx.shadowColor = `${PRIMARY}50`; ctx.shadowBlur = 15
      const paddleY = GAME_H - PADDLE_H - 12;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(g.paddleX, paddleY, PADDLE_W, PADDLE_H, 10);
      } else {
        ctx.rect(g.paddleX, paddleY, PADDLE_W, PADDLE_H);
      }
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 16px Outfit, system-ui, sans-serif'
      ctx.textAlign = 'left'; ctx.fillText(`Score: ${g.score}`, 20, 30)
      ctx.textAlign = 'right'; ctx.fillText('❤️'.repeat(Math.max(0, g.lives)), GAME_W - 20, 30)

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB] font-outfit px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-12 max-w-lg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="relative inline-block"
        >
          <h1 className="text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-rose-600 leading-none select-none">
            404
          </h1>
          <div className="absolute -top-4 -right-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-12 border border-gray-100">
            <Key size={32} className="text-primary" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-[#0f172a] mt-8 mb-2 tracking-tight">
          This page moved out.
        </h2>
        <p className="text-muted text-lg font-medium leading-relaxed">
          The keys are missing! Help us find them <br /> 
          to get back home.
        </p>
      </div>

      <div className="relative group p-1.5 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={GAME_W} 
          height={GAME_H} 
          className="block rounded-[20px] bg-white" 
          style={{ cursor: 'none' }} 
        />

        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-[6px] z-20">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 bg-rose-50 text-primary rounded-full flex items-center justify-center mb-6"
            >
              <House size={40} />
            </motion.div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-2">Key Catcher</h3>
            <p className="text-sm text-center text-muted/80 max-w-[280px] leading-relaxed mb-8">
              Catch <strong>falling keys</strong> 🔑 and <strong>houses</strong> 🏠.<br />
              Dodge the <strong>bombs</strong> 💣! Miss a key = lose a life.
            </p>
            
            {highScore > 0 && (
              <div className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-4 py-1.5 rounded-full mb-8 flex items-center gap-2">
                <Star size={12} fill="currentColor" /> Best: {highScore}
              </div>
            )}
            
            <button 
              onClick={startGame} 
              className="px-12 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all active:scale-95 cursor-pointer"
            >
              Start Finding
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-[6px] z-30">
            <div className="text-6xl mb-6">🏘️</div>
            <h3 className="text-3xl font-black text-[#0f172a] mb-2 leading-none tracking-tight">Game Over!</h3>
            <div className="text-5xl font-black text-primary mb-2">{score}</div>
            <p className="text-sm text-muted font-bold tracking-widest uppercase mb-8">keys collected</p>
            
            <div className="flex flex-col gap-4 w-full px-12">
              <button 
                onClick={startGame} 
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="w-full py-4 bg-white text-dark border border-gray-200 rounded-xl font-bold text-base hover:bg-surface transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Back to Safety
              </button>
            </div>
          </div>
        )}
      </div>

      <motion.button 
        whileHover={{ x: -4 }}
        onClick={() => navigate('/')} 
        className="mt-12 flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0f172a] border border-gray-200 hover:border-primary/20 hover:bg-white text-sm font-bold shadow-sm transition-all cursor-pointer"
      >
        <ChevronLeft size={18} /> Home Sweet Home
      </motion.button>
    </div>
  )
}

function Star({ size, fill, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill || "none"} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

