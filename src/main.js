import './style.css'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

inject()
injectSpeedInsights()

// Hand-updated per release — see README for why.
const CURRENT_VERSION = 'v0.1.2'
const DOWNLOAD_URL = 'https://github.com/kaegan/yapmeter/releases/latest/download/Yapmeter.dmg'

// --- Pet state machine, ported from the Yapmeter Landing design canvas ---

const L = 'M5.15 13.629A6.5 6.5 0 1 0 2.771 11.25L1.2 15.2Z'
const R = 'M11.65 13.629A6.5 6.5 0 1 1 14.029 11.25L15.6 15.2Z'

const STATES = [
  { id: 'asleep', color: '#4A2C2A', bar: '#F5F5F7', body: L, line: 'Meeting adjourned. Zzz…', ms: 1400 },
  { id: 'shh', color: '#FF5C7A', body: L, line: 'Shh. Their turn.', ms: 2000 },
  { id: 'peek', color: '#FFE27A', body: L, line: 'There’s a yap gap.', ms: 1200 },
  { id: 'go', color: '#7FE0A8', body: R, line: 'Time to yap!', ms: 1800 },
  { id: 'fresh', color: '#8ED0FF', body: R, line: 'You’re yapping!', ms: 4500, clockStart: 38, pillClock: false },
  { id: 'tiring', color: '#8ED0FF', body: R, line: 'You’ve been yapping for a bit now…', ms: 2200, clockStart: 134 },
  { id: 'full', color: '#8ED0FF', body: R, line: "That’s a lot of yapping.", ms: 2400, clockStart: 271 },
]

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function facePaths(stateId, ink, { wrapFull = false } = {}) {
  const faces = {
    asleep: `<path d="M5 7.3Q6.3 8.6 7.6 7.3M9.2 7.3Q10.5 8.6 11.8 7.3" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/>`,
    shh: `<circle cx="6.2" cy="7.2" r="1.05" fill="${ink}"/><circle cx="10.6" cy="7.2" r="1.05" fill="${ink}"/><rect x="6.3" y="9.8" width="4.2" height="1.7" rx=".85" fill="${ink}"/>`,
    peek: `<circle cx="5.7" cy="7.2" r="1.05" fill="${ink}"/><circle cx="10.1" cy="7.2" r="1.05" fill="${ink}"/><path d="M6.7 10.6H10.1" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/>`,
    go: `<circle cx="6.2" cy="7.2" r="1.05" fill="${ink}"/><circle cx="10.6" cy="7.2" r="1.05" fill="${ink}"/><path d="M5.9 9.9Q8.4 12.6 10.9 9.9" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>`,
    fresh: `<path d="M5 7.7Q6.3 6.2 7.6 7.7M9.2 7.7Q10.5 6.2 11.8 7.7" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M5.6 9.6H11.2C11.2 13.6 5.6 13.6 5.6 9.6Z" fill="${ink}"/>`,
    tiring: `<circle cx="6.2" cy="7.2" r="1.05" fill="${ink}"/><circle cx="10.6" cy="7.2" r="1.05" fill="${ink}"/><path d="M5.6 9.6H11.2C11.2 13.6 5.6 13.6 5.6 9.6Z" fill="${ink}"/>`,
    full: `<path d="M5 7.3Q6.3 8.6 7.6 7.3M9.2 7.3Q10.5 8.6 11.8 7.3" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/><path d="M6.4 10.8H10.4" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>`,
  }
  const markup = faces[stateId] || ''
  if (stateId === 'full' && wrapFull) {
    return `<g transform="translate(8.4 8) scale(1.14) translate(-8.4 -8)">${markup}</g>`
  }
  return markup
}

function initPetDemo() {
  const demo = document.getElementById('pet-demo')
  if (!demo) return

  const menubarBody = document.getElementById('menubar-body')
  const menubarFace = document.getElementById('menubar-face')
  const menubarClock = document.getElementById('menubar-clock')
  const petLine = document.getElementById('pet-line')
  const heroSvg = document.getElementById('hero-svg')
  const heroBody = document.getElementById('hero-body')
  const heroFace = document.getElementById('hero-face')

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let i = 1 // start on "shh", matching the design's default preview state
  let elapsed = 0
  let hover = false

  function render() {
    const st = STATES[i]
    const clock = st.clockStart != null ? fmt(st.clockStart + Math.floor(elapsed / 1000)) : ''

    menubarBody.setAttribute('d', st.body)
    menubarBody.setAttribute('fill', st.bar || st.color)
    menubarFace.innerHTML = facePaths(st.id, '#1E1E20', { wrapFull: true })
    menubarClock.textContent = clock

    petLine.textContent = clock && st.pillClock !== false ? `${st.line} ${clock}` : st.line

    heroBody.setAttribute('d', st.body)
    heroBody.setAttribute('fill', st.color)
    heroFace.innerHTML = facePaths(st.id, '#FFF6EA', { wrapFull: false })
    heroSvg.style.transform = st.id === 'full' ? 'scale(1.14)' : 'scale(1)'
  }

  function next() {
    i = (i + 1) % STATES.length
    elapsed = 0
    render()
  }

  render()

  if (!reduceMotion) {
    setInterval(() => {
      if (hover) return
      elapsed += 200
      if (elapsed >= STATES[i].ms) {
        next()
      } else {
        render()
      }
    }, 200)
  }

  demo.addEventListener('mouseenter', () => {
    next()
    hover = true
  })
  demo.addEventListener('mouseleave', () => {
    hover = false
  })
  demo.addEventListener('click', next)
}

function initStickyHeader() {
  const header = document.getElementById('site-header')
  if (!header) return

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 4)
  update()
  window.addEventListener('scroll', update, { passive: true })
}

function initDownloadCtas() {
  document.querySelectorAll('.js-download-cta').forEach((el) => {
    el.href = DOWNLOAD_URL
    el.addEventListener('click', () => {
      if (window.posthog) window.posthog.capture('download_click')
    })
  })

  document.querySelectorAll('.js-cta-version').forEach((el) => {
    el.textContent = CURRENT_VERSION
  })
}

initPetDemo()
initStickyHeader()
initDownloadCtas()
