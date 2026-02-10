const el = id => document.getElementById(id)
const qs = s => document.querySelector(s)
const qsa = s => Array.from(document.querySelectorAll(s))

const state = {
  player: '',
  category: 'semua',
  difficulty: 'mudah',
  total: 10,
  pool: [],
  index: 0,
  score: 0,
  correct: 0,
  timeLeft: 0,
  tick: null,
  allowSound: true,
  questionSeconds: 15
}

const QUESTIONS = [
  {t:'Ibukota Indonesia?',o:['Bandung','Medan','Jakarta','Surabaya'],a:2,c:'umum',d:'mudah'},
  {t:'Simbol kimia air?',o:['O2','H2O','CO2','NaCl'],a:1,c:'sains',d:'mudah'},
  {t:'HTML kepanjangan dari?',o:['HyperText Markup Language','HighText Machine Language','HyperTools Make Language','Hyper Transfer Mail'],a:0,c:'teknologi',d:'mudah'},
  {t:'Planet terdekat dengan Matahari?',o:['Venus','Merkurius','Mars','Bumi'],a:1,c:'sains',d:'mudah'},
  {t:'Bahasa pemrograman untuk web interaktif?',o:['CSS','HTML','JavaScript','SQL'],a:2,c:'teknologi',d:'mudah'},
  {t:'Warna primer cahaya?',o:['Merah Hijau Biru','Merah Kuning Biru','Hitam Putih Abu','Cyan Magenta Kuning'],a:0,c:'sains',d:'sedang'},
  {t:'CPU singkatan dari?',o:['Central Processing Unit','Computer Power Unit','Core Primary Unit','Central Program Utility'],a:0,c:'teknologi',d:'sedang'},
  {t:'Penemu bola lampu?',o:['Nikola Tesla','Alexander Bell','Thomas Edison','Albert Einstein'],a:2,c:'umum',d:'sedang'},
  {t:'CSS digunakan untuk?',o:['Struktur','Interaksi','Gaya','Database'],a:2,c:'teknologi',d:'mudah'},
  {t:'Elemen terbanyak di udara?',o:['Oksigen','Nitrogen','Karbon Dioksida','Hidrogen'],a:1,c:'sains',d:'sedang'},
  {t:'Framework JS untuk UI?',o:['Django','Laravel','React','Flask'],a:2,c:'teknologi',d:'sedang'},
  {t:'Alat ukur arus listrik?',o:['Voltmeter','Ohmmeter','Ammeter','Barometer'],a:2,c:'sains',d:'sulit'},
  {t:'Hari Kemerdekaan RI?',o:['17 Agustus','20 Mei','10 November','1 Juni'],a:0,c:'umum',d:'mudah'},
  {t:'HTTP adalah?',o:['Protokol','Bahasa','Database','Perangkat'],a:0,c:'teknologi',d:'mudah'},
  {t:'Bintang terdekat ke Bumi?',o:['Sirius','Matahari','Proxima Centauri','Vega'],a:1,c:'sains',d:'mudah'},
  {t:'Genre film horor menonjolkan?',o:['Ketegangan','Komedi','Romansa','Dokumenter'],a:0,c:'hiburan',d:'mudah'},
  {t:'Algoritma pencarian biner butuh data?',o:['Acak','Terurut','Teks','Terkompresi'],a:1,c:'teknologi',d:'sulit'},
  {t:'Satuan gaya dalam SI?',o:['Joule','Pascal','Newton','Watt'],a:2,c:'sains',d:'sedang'},
  {t:'Studio animasi Toy Story?',o:['DreamWorks','Pixar','Illumination','Disney TV'],a:1,c:'hiburan',d:'sedang'},
  {t:'Bahasa untuk styling?',o:['Python','CSS','C++','Rust'],a:1,c:'teknologi',d:'mudah'},
  {t:'Ibukota Jepang?',o:['Osaka','Tokyo','Kyoto','Nagoya'],a:1,c:'umum',d:'mudah'},
  {t:'Gunung tertinggi di dunia?',o:['K2','Everest','Kilimanjaro','Denali'],a:1,c:'umum',d:'sedang'},
  {t:'Mata uang Jepang?',o:['Won','Yuan','Yen','Ringgit'],a:2,c:'umum',d:'mudah'},
  {t:'Benua terbesar?',o:['Afrika','Asia','Amerika','Eropa'],a:1,c:'umum',d:'mudah'},
  {t:'Hewan mamalia laut besar?',o:['Paus','Hiu','Gurita','Lumba-lumba'],a:0,c:'umum',d:'mudah'},
  {t:'Proses fotosintesis terjadi di?',o:['Mitokondria','Kloroplas','Nukleus','Ribosom'],a:1,c:'sains',d:'sedang'},
  {t:'Satuan energi dalam SI?',o:['Watt','Joule','Newton','Tesla'],a:1,c:'sains',d:'mudah'},
  {t:'Gas rumah kaca utama?',o:['CO2','O2','N2','H2'],a:0,c:'sains',d:'sedang'},
  {t:'Planet dengan cincin paling mencolok?',o:['Saturnus','Jupiter','Uranus','Neptunus'],a:0,c:'sains',d:'mudah'},
  {t:'CSS kepanjangan dari?',o:['Cascading Style Sheets','Creative Style Script','Core Styling System','Common Style Source'],a:0,c:'teknologi',d:'mudah'},
  {t:'SQL digunakan untuk?',o:['Styling','Basis data','Grafik','Jaringan'],a:1,c:'teknologi',d:'mudah'},
  {t:'Perintah git untuk menyimpan perubahan lokal?',o:['git push','git commit','git clone','git fetch'],a:1,c:'teknologi',d:'sedang'},
  {t:'HTTP status 404 artinya?',o:['OK','Unauthorized','Not Found','Server Error'],a:2,c:'teknologi',d:'mudah'},
  {t:'Bahasa yang berjalan di browser?',o:['Java','Go','JavaScript','PHP'],a:2,c:'teknologi',d:'mudah'},
  {t:'Prosesor grafis disebut?',o:['CPU','RAM','GPU','SSD'],a:2,c:'teknologi',d:'mudah'},
  {t:'Kecepatan cahaya ~ ?',o:['3×10^8 m/s','3×10^6 m/s','3×10^4 m/s','3×10^2 m/s'],a:0,c:'sains',d:'sulit'},
  {t:'Unit suhu SI?',o:['Celsius','Fahrenheit','Kelvin','Rankine'],a:2,c:'sains',d:'sedang'},
  {t:'Proses air menjadi uap?',o:['Kondensasi','Evaporasi','Sublimasi','Deposisi'],a:1,c:'sains',d:'mudah'},
  {t:'Genre film dengan nyanyian?',o:['Musikal','Dokumenter','Thriller','Sci-fi'],a:0,c:'hiburan',d:'mudah'},
  {t:'Konsol game dari Sony?',o:['Switch','Xbox','PlayStation','GameCube'],a:2,c:'hiburan',d:'mudah'},
  {t:'Olahraga dengan raket?',o:['Sepak bola','Bola basket','Badminton','Bola voli'],a:2,c:'hiburan',d:'mudah'},
  {t:'Ibukota Prancis?',o:['Paris','Lyon','Nice','Marseille'],a:0,c:'umum',d:'mudah'},
  {t:'Laut terbesar di dunia?',o:['Karibia','Baltik','Pasifik','Hindia'],a:2,c:'umum',d:'sedang'},
  {t:'Tulang paling kuat?',o:['Tengkorak','Paha','Lengan','Rusuk'],a:1,c:'sains',d:'sedang'},
  {t:'Elemen kimia dengan simbol Fe?',o:['Seng','Tembaga','Besi','Perak'],a:2,c:'sains',d:'mudah'},
  {t:'Algoritma pengurutan populer?',o:['Binary Search','Quick Sort','DFS','Dijkstra'],a:1,c:'teknologi',d:'sedang'},
  {t:'Bahasa backend umum?',o:['CSS','HTML','JavaScript','PHP'],a:3,c:'teknologi',d:'mudah'},
  {t:'Perangkat untuk penyimpanan data?',o:['SSD','GPU','CPU','PSU'],a:0,c:'teknologi',d:'mudah'},
  {t:'Iklim gurun ditandai dengan?',o:['Hujan tinggi','Kelembapan tinggi','Curah hujan rendah','Salju sering'],a:2,c:'umum',d:'sedang'},
  {t:'Bahan bakar fosil bukan?',o:['Batubara','Minyak','Gas alam','Biomassa'],a:3,c:'sains',d:'sedang'},
  {t:'Protokol aman versi HTTP?',o:['FTP','SMTP','HTTPS','SSH'],a:2,c:'teknologi',d:'mudah'},
  {t:'Resolusi gambar diukur dalam?',o:['Piksel','Meter','Joule','Newton'],a:0,c:'teknologi',d:'mudah'},
  {t:'Gaya tarik bumi disebut?',o:['Gesekan','Gravitasi','Tekanan','Imbas'],a:1,c:'sains',d:'mudah'},
  {t:'Benua dengan piramida Giza?',o:['Asia','Afrika','Eropa','Amerika'],a:1,c:'umum',d:'mudah'},
  {t:'Seni dengan kanvas dan cat?',o:['Patung','Fotografi','Lukis','Keramik'],a:2,c:'hiburan',d:'mudah'},
  {t:'File gaya web berekstensi?',o:['.js','.html','.css','.json'],a:2,c:'teknologi',d:'mudah'},
  {t:'Basis data relasional populer?',o:['MySQL','MongoDB','Redis','Neo4j'],a:0,c:'teknologi',d:'sedang'},
  {t:'Unit tegangan listrik?',o:['Ampere','Volt','Ohm','Watt'],a:1,c:'sains',d:'mudah'},
  {t:'Planet dengan banyak badai merah?',o:['Mars','Jupiter','Saturnus','Neptunus'],a:1,c:'sains',d:'sedang'},
  {t:'Perintah git untuk membuat cabang?',o:['git branch','git merge','git tag','git pull'],a:0,c:'teknologi',d:'sedang'},
  {t:'Bahasa untuk data science?',o:['Ruby','Python','C#','Swift'],a:1,c:'teknologi',d:'sedang'},
  {t:'Olahraga Olimpiade air?',o:['Renang','Tenis','Tinju','Anggar'],a:0,c:'hiburan',d:'mudah'},
  {t:'Kota kelahiran Nabi Muhammad?',o:['Madinah','Mekah','Taif','Yathrib'],a:1,c:'sejarah-islam',d:'mudah'},
  {t:'Hijrah Nabi menuju?',o:['Mekah','Madinah','Taif','Basra'],a:1,c:'sejarah-islam',d:'mudah'},
  {t:'Awal kalender Hijriah ditandai oleh?',o:['Perang Badar','Fathu Makkah','Hijrah ke Madinah','Haji Wada'],a:2,c:'sejarah-islam',d:'sedang'},
  {t:'Khalifah pertama setelah Nabi?',o:['Umar','Utsman','Ali','Abu Bakar'],a:3,c:'sejarah-islam',d:'mudah'},
  {t:'Khalifah kedua?',o:['Abu Bakar','Umar','Utsman','Ali'],a:1,c:'sejarah-islam',d:'mudah'},
  {t:'Khalifah ketiga?',o:['Ali','Utsman','Umar','Muawiyah'],a:1,c:'sejarah-islam',d:'mudah'},
  {t:'Khalifah keempat?',o:['Hasan','Ali','Muawiyah','Umar'],a:1,c:'sejarah-islam',d:'mudah'},
  {t:'Perang besar pertama dalam Islam?',o:['Uhud','Badar','Khandaq','Hunain'],a:1,c:'sejarah-islam',d:'sedang'},
  {t:'Fathu Makkah berarti?',o:['Perang Uhud','Pembebasan Mekah','Perjanjian Hudaibiyah','Hijrah'],a:1,c:'sejarah-islam',d:'sedang'},
  {t:'Ibukota Dinasti Umayyah?',o:['Baghdad','Kairo','Damaskus','Cordoba'],a:2,c:'sejarah-islam',d:'sedang'},
  {t:'Ibukota Dinasti Abbasiyah?',o:['Damaskus','Baghdad','Kufa','Basra'],a:1,c:'sejarah-islam',d:'sedang'},
  {t:'Penulis kitab Aljabar?',o:['Ibn Sina','Al-Kindi','Al-Khwarizmi','Al-Farabi'],a:2,c:'sejarah-islam',d:'sedang'},
  {t:'Tokoh kamera obscura?',o:['Al-Razi','Ibn al-Haytham','Al-Biruni','Al-Farabi'],a:1,c:'sejarah-islam',d:'sedang'},
  {t:'Masjid pertama yang dibangun?',o:['Masjid Nabawi','Masjidil Haram','Masjid Quba','Masjid Aqsa'],a:2,c:'sejarah-islam',d:'mudah'},
  {t:'Perjanjian Hudaibiyah terjadi di?',o:['Badar','Hudaibiyah','Khaibar','Tabuk'],a:1,c:'sejarah-islam',d:'sulit'},
  {t:'Al-Azhar berlokasi di?',o:['Kairo','Baghdad','Damaskus','Cordoba'],a:0,c:'sejarah-islam',d:'mudah'}
]

const rnd = arr => arr[Math.floor(Math.random()*arr.length)]
const shuffle = arr => arr.sort(()=>Math.random()-0.5)

const audio = {
  ctx: null,
  init() {
    this.ctx = new (window.AudioContext||window.webkitAudioContext)()
  },
  beep(freq=660,ms=150,type='sine',gain=0.06){
    if(!state.allowSound) return
    if(!this.ctx) this.init()
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.value = gain
    o.connect(g); g.connect(this.ctx.destination)
    o.start()
    setTimeout(()=>o.stop(), ms)
  }
}

function show(id){
  qsa('.view').forEach(v=>v.classList.remove('active'))
  el(id).classList.add('active')
  applyBgForView(id)
}

function setupStart(){
  el('startBtn').addEventListener('click', ()=>{
    state.player = (el('playerName').value||'Pemain').trim().slice(0,18)
    state.category = el('category').value
    state.difficulty = el('difficulty').value
    state.total = parseInt(el('questionCount').value||'10',10)
    startGame()
  })
  el('openSettings').addEventListener('click', ()=> qs('#settingsModal').classList.remove('hidden'))
  el('closeSettings').addEventListener('click', ()=> qs('#settingsModal').classList.add('hidden'))
  el('toggleSound').addEventListener('change', e=> state.allowSound = e.target.checked)
  el('openLeaderboard').addEventListener('click', ()=> openLeaderboardModal())
  el('closeLeaderboard').addEventListener('click', ()=> qs('#leaderboardModal').classList.add('hidden'))
}

function filterQuestions(){
  let pool = QUESTIONS.slice()
  if(state.category!=='semua') pool = pool.filter(q=>q.c===state.category)
  const matchDiff = q=>{
    if(state.difficulty==='mudah') return true
    if(state.difficulty==='sedang') return q.d!=='mudah'
    return q.d==='sulit'
  }
  pool = pool.filter(matchDiff)
  shuffle(pool)
  let result = pool.slice(0, state.total)
  if(result.length < state.total){
    const byDiff = QUESTIONS.filter(q=>matchDiff(q) && !result.includes(q))
    shuffle(byDiff)
    result = result.concat(byDiff.slice(0, state.total - result.length))
  }
  if(result.length < state.total){
    const any = QUESTIONS.filter(q=>!result.includes(q))
    shuffle(any)
    result = result.concat(any.slice(0, state.total - result.length))
  }
  return result.slice(0, state.total)
}

function startGame(){
  state.pool = filterQuestions()
  state.index = 0
  state.score = 0
  state.correct = 0
  state.timeLeft = 0
  el('score').textContent = '0'
  el('chipCategory').textContent = 'Kategori: '+state.category
  el('chipDifficulty').textContent = 'Kesulitan: '+state.difficulty
  updateProgress()
  show('viewQuiz')
  nextQuestion()
}

function updateProgress(){
  const pct = (state.index/state.total)*100
  el('progressBar').style.width = `${pct}%`
}

function setTimer(seconds){
  clearInterval(state.tick)
  let t = seconds
  el('timeText').textContent = t
  setRing(100)
  state.tick = setInterval(()=>{
    t -= 1
    if(t<=0){
      clearInterval(state.tick)
      autoFail()
    }else{
      el('timeText').textContent = t
      const pct = Math.round((t/seconds)*100)
      setRing(pct)
    }
  },1000)
}

function setRing(pct){
  const ring = el('timerRing')
  ring.style.stroke = `conic-gradient(from 0deg,#29d398, #00e1ff)`
  ring.style.strokeDasharray = `100,100`
  ring.style.strokeDashoffset = `${100-pct}`
}

function renderQuestion(){
  const q = state.pool[state.index]
  el('qIndex').textContent = (state.index+1)
  el('qText').textContent = q.t
  const opts = q.o.map((text,i)=>{
    const div = document.createElement('button')
    div.className = 'option'
    div.innerHTML = `<span>${String.fromCharCode(65+i)}.</span><span>${text}</span>`
    div.addEventListener('click', ()=> choose(i))
    return div
  })
  const box = el('options')
  box.innerHTML = ''
  opts.forEach(o=>box.appendChild(o))
  el('nextBtn').disabled = true
}

function nextQuestion(){
  if(state.index>=state.total){
    endGame()
    return
  }
  renderQuestion()
  setTimer(state.questionSeconds)
  el('skipBtn').onclick = skipQuestion
  el('nextBtn').onclick = ()=>{
    state.index += 1
    updateProgress()
    nextQuestion()
  }
}

function skipQuestion(){
  clearInterval(state.tick)
  const nodes = qsa('.option')
  nodes.forEach(n=> n.classList.add('disabled'))
  mark(false)
  state.index += 1
  updateProgress()
  nextQuestion()
}
function choose(i){
  clearInterval(state.tick)
  const q = state.pool[state.index]
  const nodes = qsa('.option')
  nodes.forEach(n=> n.classList.add('disabled'))
  nodes[q.a].classList.add('correct')
  if(i===q.a){
    mark(true)
  }else{
    nodes[i].classList.add('wrong')
    mark(false)
  }
}

function mark(correct){
  if(correct){
    state.correct += 1
    state.score += 10
    audio.beep(880,150,'sine',0.08)
  }else{
    audio.beep(220,200,'sine',0.05)
  }
  const t = parseInt(el('timeText').textContent||'0',10)
  state.timeLeft += Math.max(0,t)
  el('score').textContent = state.score
  el('nextBtn').disabled = false
}

function autoFail(){
  const nodes = qsa('.option')
  nodes.forEach(n=> n.classList.add('disabled'))
  const q = state.pool[state.index]
  nodes[q.a].classList.add('correct')
  mark(false)
}

function endGame(){
  const acc = Math.round((state.correct/state.total)*100)
  el('finalScore').textContent = state.score
  el('finalAccuracy').textContent = acc+'%'
  el('finalTime').textContent = state.timeLeft+' detik'
  show('viewResult')
  el('playAgain').onclick = ()=> show('viewStart')
  el('saveScore').onclick = ()=> saveLeaderboard()
  renderLeaderboard(el('leaderboard'))
}

function saveLeaderboard(){
  const list = JSON.parse(localStorage.getItem('neon_lb')||'[]')
  list.push({n:state.player,s:state.score,a:state.correct,t:Date.now()})
  list.sort((a,b)=> b.s - a.s)
  localStorage.setItem('neon_lb', JSON.stringify(list.slice(0,20)))
  openLeaderboardModal()
}

function renderLeaderboard(container){
  const list = JSON.parse(localStorage.getItem('neon_lb')||'[]').slice(0,8)
  container.innerHTML = list.map((it,idx)=>{
    const d = new Date(it.t)
    return `<div class="lb-item"><div>#${idx+1} ${it.n}</div><div>${it.s}</div></div>`
  }).join('') || '<div class="muted">Belum ada skor tersimpan.</div>'
}

function openLeaderboardModal(){
  const m = qs('#leaderboardModal')
  const c = el('leaderboardModalList')
  renderLeaderboard(c)
  m.classList.remove('hidden')
}

document.addEventListener('DOMContentLoaded', ()=>{
  setupStart()
  const brandLogo = el('brandLogo')
  const heroLogo = el('heroLogo')
  if(brandLogo){
    brandLogo.addEventListener('load', ()=>{
      const bi = qs('.brand-icon')
      if(bi) bi.classList.add('hidden')
    })
    brandLogo.addEventListener('error', ()=>{
      brandLogo.classList.add('hidden')
    })
  }
  if(heroLogo){
    heroLogo.addEventListener('error', ()=> heroLogo.classList.add('hidden'))
  }
  const stored = localStorage.getItem('neon_logo')
  if(stored){
    if(brandLogo){ brandLogo.src = stored }
    if(heroLogo){ heroLogo.src = stored }
  }
  const bgStored = localStorage.getItem('neon_bg')
  if(bgStored){
    applyBgForView('viewStart')
  }
  const upload = el('logoUpload')
  const reset = el('resetLogo')
  const bgUpload = el('bgUpload')
  const resetBg = el('resetBg')
  if(upload){
    upload.addEventListener('change', e=>{
      const f = e.target.files && e.target.files[0]
      if(!f) return
      const r = new FileReader()
      r.onload = ()=>{
        const data = r.result
        localStorage.setItem('neon_logo', data)
        if(brandLogo){ brandLogo.src = data }
        if(heroLogo){ heroLogo.src = data }
      }
      r.readAsDataURL(f)
    })
  }
  if(reset){
    reset.addEventListener('click', ()=>{
      localStorage.removeItem('neon_logo')
      if(brandLogo){ brandLogo.src = 'assets/logo.jpg' }
      if(heroLogo){ heroLogo.src = 'assets/logo.jpg' }
    })
  }
  if(bgUpload){
    bgUpload.addEventListener('change', e=>{
      const f = e.target.files && e.target.files[0]
      if(!f) return
      const r = new FileReader()
      r.onload = ()=>{
        const data = r.result
        localStorage.setItem('neon_bg', data)
        applyBgForView('viewStart')
      }
      r.readAsDataURL(f)
    })
  }
  if(resetBg){
    resetBg.addEventListener('click', ()=>{
      localStorage.removeItem('neon_bg')
      applyBgForView('viewStart')
    })
  }
})

function applyBgForView(viewId){
  const bg = qs('.bg')
  if(!bg) return
  const img = localStorage.getItem('neon_bg') || ''
  if(viewId === 'viewStart' && img){
    bg.style.backgroundImage = `url(${img})`
  }else{
    bg.style.backgroundImage = ''
  }
}
