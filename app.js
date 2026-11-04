/**
 * BAHASA HUMANIS-DIGITAL - CORE JAVASCRIPT ENGINE
 * Sinergi Mahatma Gandhi (Ahimsa & Satyagraha) & Ki Hadjar Dewantara (Sistem Among / Tri-N)
 * Prototipe Disertasi S3 Mas Farhan
 */

// ============================================================================
// 1. NAVIGATION & TAB SWITCHING
// ============================================================================
function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Show target tab
  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) {
    targetTab.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function toggleTheme() {
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    html.classList.remove('dark');
  } else {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  }
}

// ============================================================================
// 2. WEB AUDIO API: SYNTHESIZED SOUNDSCAPE & GAMELAN
// ============================================================================
let audioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;
let isAmbientPlaying = false;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function toggleAmbientSound() {
  initAudio();
  if (!audioCtx) return;

  const iconOff = document.getElementById('soundIconOff');
  const iconOn = document.getElementById('soundIconOn');

  if (isAmbientPlaying) {
    // Stop ambient drone
    if (ambientGain) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        if (ambientOsc1) ambientOsc1.stop();
        if (ambientOsc2) ambientOsc2.stop();
        ambientOsc1 = null;
        ambientOsc2 = null;
      }, 1200);
    }
    isAmbientPlaying = false;
    iconOff.classList.remove('hidden');
    iconOn.classList.add('hidden');
  } else {
    // Start warm meditative harmonic drone (Sa-Pa drone / Gamelan resonance ~130.81Hz & 196Hz)
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.5);
    ambientGain.connect(audioCtx.destination);

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(130.81, audioCtx.currentTime); // C3 fundamental

    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(196.00, audioCtx.currentTime); // G3 harmonic

    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(ambientGain);

    ambientOsc1.start();
    ambientOsc2.start();

    isAmbientPlaying = true;
    iconOff.classList.add('hidden');
    iconOn.classList.remove('hidden');
  }
}

// Realistic Gamelan Bronze Bell Synthesizer
function playGamelanTone(freq, noteName) {
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  
  // Strike oscillator (fundamental bronze frequency)
  const oscMain = audioCtx.createOscillator();
  const oscOvertone = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscMain.type = 'sine';
  oscMain.frequency.setValueAtTime(freq, now);

  // Metallic overtone (non-harmonic bronze partial typical of Gamelan pelog/slendro)
  oscOvertone.type = 'triangle';
  oscOvertone.frequency.setValueAtTime(freq * 2.76, now);

  // Percussive strike envelope (fast attack, lingering metallic decay)
  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

  oscMain.connect(gainNode);
  oscOvertone.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscMain.start(now);
  oscOvertone.start(now);
  oscMain.stop(now + 2.5);
  oscOvertone.stop(now + 2.5);

  // Optional speech readout of Javanese note
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(noteName);
    utterance.lang = 'id-ID';
    utterance.rate = 1.1;
    // window.speechSynthesis.speak(utterance);
  }
}

// ============================================================================
// 3. PHILOSOPHY CONVERGENCE DETAILS
// ============================================================================
const philosophyData = {
  gandhi: {
    badge: 'bg-saffron',
    title: 'Ahimsa & Satyagraha: Jiwa Anti-Kekerasan Verbal di Ruang Digital',
    text: `
      <p>Bagi Mahatma Gandhi, <strong>Ahimsa</strong> bukan sekadar kepasifan, melainkan cinta kasih aktif (*active love*). Dalam konteks platform ini, Ahimsa dimanifestasikan sebagai <strong>Digital Ahimsa</strong>: tekad moral pembelajar untuk menolak ujaran kebencian (*hate speech*), menghindari provokasi siber, dan selalu menggunakan kata-kata yang mendamaikan.</p>
      <p class="mt-2"><strong>Satyagraha</strong> (Kekuatan Kebenaran) mengajarkan pembelajar bahasa untuk senantiasa jujur, jernih, dan berani membela nilai kemanusiaan tanpa menggunakan instrumen penghinaan ataupun manipulasi linguistik.</p>
    `
  },
  sintesis: {
    badge: 'bg-amber-500',
    title: 'Model Pembelajaran Bahasa Humanis-Digital (Sintesis Doktoral)',
    text: `
      <p>Sintesis ini adalah jawaban atas krisis kemanusiaan di abad ke-21. Algoritma komputer dan platform berbasis web yang dikembangkan oleh Mas Farhan difungsikan sebagai <em>enabler</em> (pemungkin), bukan pengganti relasi kemanusiaan.</p>
      <p class="mt-2">Melalui integrasi Tri-N dan Digital Ahimsa, pembelajar dari berbagai penjuru bumi tidak hanya terampil berbicara Bahasa Indonesia secara pragmatik, namun juga terdidik jiwanya untuk menjadi agen perdamaian dunia (*Global Citizens of Peace*).</p>
    `
  },
  dewantara: {
    badge: 'bg-tealNusantara',
    title: 'Sistem Among & Tri-N: Pedagogi Merdeka yang Berakar pada Kodrat Manusia',
    text: `
      <p>Ki Hadjar Dewantara merumuskan pendidikan sebagai proses 'menuntun segala kodrat yang ada pada anak-anak agar mereka mencapai keselamatan dan kebahagiaan setinggi-tingginya'.</p>
      <p class="mt-2">Dalam kurikulum platform ini:
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Ngerti (Kognitif):</strong> Pembelajar memahami kaidah bahasa dan kedalaman teks sastra bernilai luhur.</li>
          <li><strong>Ngroso (Afektif):</strong> Pembelajar mengasah kepekaan rasa hati, tepasira, dan empati sosial.</li>
          <li><strong>Ngelakoni (Psikomotorik):</strong> Pembelajar mempraktikkan tutur kata yang santun dan tindakan kolaborasi nyata.</li>
        </ul>
      </p>
    `
  }
};

function showPhilosophyDetail(key) {
  const item = philosophyData[key];
  if (!item) return;

  const badge = document.getElementById('detailBadge');
  const title = document.getElementById('detailTitle');
  const content = document.getElementById('detailContent');

  badge.className = `w-3 h-3 rounded-full ${item.badge}`;
  title.innerText = item.title;
  content.innerHTML = item.text;
}

// ============================================================================
// 4. RUANG KELAS TRI-N SUBTABS & ACTIVITIES
// ============================================================================
function switchTriSubTab(subTabId) {
  const tabs = ['ngerti', 'ngroso', 'ngelakoni'];
  tabs.forEach(t => {
    const content = document.getElementById(`subtab-${t}`);
    const btn = document.getElementById(`btnTri${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (t === subTabId) {
      if (content) content.classList.remove('hidden');
      if (btn) btn.classList.add('active');
    } else {
      if (content) content.classList.add('hidden');
      if (btn) btn.classList.remove('active');
    }
  });
}

function playVocabWord(word) {
  initAudio();
  const vocabDict = {
    tepasira: {
      term: 'Tepasira',
      meaning: 'Sikap tenggang rasa; mampu merasakan apa yang dirasakan oleh orang lain sebelum bertutur atau bertindak.'
    },
    ahimsa: {
      term: 'Ahimsa',
      meaning: 'Prinsip anti-kekerasan; menolak melukai makhluk hidup lain baik dengan pikiran, perkataan, maupun perbuatan.'
    },
    among: {
      term: 'Sistem Among',
      meaning: 'Metode pengasuhan pendidikan: Asah (menajamkan pikiran), Asih (menebar kasih sayang), Asuh (membimbing dengan teladan).'
    }
  };

  const data = vocabDict[word];
  if (!data) return;

  // Sound chime
  if (audioCtx) {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.5);
  }

  // Voice synthesis if available
  if ('speechSynthesis' in window) {
    const utt = new SpeechSynthesisUtterance(data.term);
    utt.lang = 'id-ID';
    window.speechSynthesis.speak(utt);
  }

  alert(`[Glosarium Humanis]\n${data.term.toUpperCase()}:\n${data.meaning}`);
}

// Cognitive Quiz Logic
function selectQuizAnswer(element, isCorrect, feedbackMsg) {
  const container = document.getElementById('quizContainer');
  const options = container.querySelectorAll('.quiz-opt');
  const feedback = document.getElementById('quizFeedback');
  const badge = document.getElementById('quizScoreBadge');

  options.forEach(opt => {
    opt.classList.remove('selected-correct', 'selected-wrong');
  });

  if (isCorrect) {
    element.classList.add('selected-correct');
    badge.innerText = 'Skor: 100/100';
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200';
    feedback.className = 'p-3 rounded-xl text-xs font-medium leading-relaxed bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200';
    feedback.innerHTML = `<strong>Jawaban Benar!</strong> &bull; ${feedbackMsg}`;
  } else {
    element.classList.add('selected-wrong');
    badge.innerText = 'Skor: 40/100';
    badge.className = 'text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
    feedback.className = 'p-3 rounded-xl text-xs font-medium leading-relaxed bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
    feedback.innerHTML = `<strong>Perlu Evaluasi:</strong> &bull; ${feedbackMsg}`;
  }
  feedback.classList.remove('hidden');
}

// Empathy Simulation (Ngroso / Digital Ahimsa)
function chooseEmpathyOption(type) {
  const fill = document.getElementById('empathyFillBar');
  const label = document.getElementById('empathyScoreLabel');
  const note = document.getElementById('empathyFeedbackText');

  if (type === 'reaktif') {
    fill.style.width = '25%';
    fill.style.background = '#EF4444';
    label.innerText = '25% (Rendah - Agresif)';
    label.className = 'text-red-500 font-bold';
    note.innerHTML = `
      <span class="text-red-600 font-bold">Analisis Pedagogis:</span> Merespons kemarahan dengan kemarahan hanya akan melipatgandakan polarisasi di ruang digital. Ini bertentangan dengan prinsip <em>Ahimsa</em> (Gandhi) yang mengajarkan bahwa kebencian tidak akan pernah berakhir jika dibalas dengan kebencian.
    `;
  } else if (type === 'pasif') {
    fill.style.width = '55%';
    fill.style.background = '#F59E0B';
    label.innerText = '55% (Sedang - Pasif)';
    label.className = 'text-amber-500 font-bold';
    note.innerHTML = `
      <span class="text-amber-600 font-bold">Analisis Pedagogis:</span> Mengabaikan komentar negatif memang melindungi diri sendiri dari pertengkaran, namun tidak memberikan edukasi transformatif bagi lawan bicara. Ini belum memenuhi tahap <em>Ing Madyo Mangun Karso</em> (membangun semangat kesalingpahaman).
    `;
  } else if (type === 'ahimsa') {
    fill.style.width = '95%';
    fill.style.background = 'linear-gradient(90deg, #10B981, #059669)';
    label.innerText = '95% (Sangat Luhur - Digital Ahimsa)';
    label.className = 'text-emeraldAmong font-bold';
    note.innerHTML = `
      <span class="text-emerald-600 font-bold">Pencapaian Sempurna!</span> Anda berhasil menerapkan <strong>Digital Ahimsa</strong> dan prinsip <strong>Tut Wuri Handayani</strong>: merendahkan hati untuk menaikkan martabat dialog, mengakui proses belajar diri sendiri, sekaligus mengundang lawan bicara masuk ke dalam ruang persaudaraan yang tulus.
    `;
  }
}

// Essay Sandbox (Ngelakoni)
const essayInput = document.getElementById('essayInput');
if (essayInput) {
  essayInput.addEventListener('input', () => {
    const charCount = document.getElementById('charCount');
    if (charCount) {
      charCount.innerText = `${essayInput.value.length} karakter`;
    }
  });
}

function evaluateEssay() {
  const text = (document.getElementById('essayInput') || {}).value || '';
  const scoreK = document.getElementById('scoreKesantunan');
  const scoreE = document.getElementById('scoreEmpati');
  const barK = document.getElementById('barKesantunan');
  const barE = document.getElementById('barEmpati');
  const note = document.getElementById('essayFeedbackNote');

  if (text.trim().length < 20) {
    alert('Silakan tuliskan setidaknya 1-2 kalimat lengkap (minimal 20 karakter) agar sistem dapat menganalisis dimensi kesantunan dan empati Anda.');
    return;
  }

  // Pedagogical analysis of keywords (politeness & empathy indicators)
  const politeKeywords = ['terima kasih', 'mohon', 'tolong', 'menghargai', 'belajar', 'santun', 'persahabatan', 'damai', 'saling', 'harmoni', 'budaya'];
  let hits = 0;
  politeKeywords.forEach(k => {
    if (text.toLowerCase().includes(k)) hits++;
  });

  const basePolite = Math.min(95, 65 + (hits * 10));
  const baseEmpathy = Math.min(98, 70 + (hits * 9));

  scoreK.innerText = `${basePolite}% (Sangat Santun)`;
  scoreE.innerText = `${baseEmpathy}% (Reflektif-Humanis)`;
  barK.style.width = `${basePolite}%`;
  barE.style.width = `${baseEmpathy}%`;

  note.innerHTML = `
    <strong>Catatan Evaluasi Tri-N (Pendidik):</strong><br>
    Tulisan Anda menunjukkan kesadaran bahasa tingkat tinggi. Anda berhasil mengekspresikan gagasan tanpa arogansi, memadukan kognisi yang jernih (*Ngerti*) dengan rasa empati mendalam (*Ngroso*), yang siap menjadi landasan tindakan sosial (*Ngelakoni*). Pertahankan semangat dialogis ini!
  `;
}

// ============================================================================
// 5. SIMULASI KOMUNIKASI LINTAS BUDAYA (ROLE-PLAY)
// ============================================================================
const scenarios = {
  1: {
    category: 'Konteks Diplomasi Formal',
    title: 'Menegosiasikan MoU Beasiswa Pertukaran Mahasiswa India-Indonesia',
    narrative: `Anda mendampingi delegasi dalam ruang perundingan. Pihak mitra dari Indonesia tersenyum dan mengangguk berulang kali saat Anda memaparkan usulan program. Rekan Anda mengira mereka sudah setuju 100%. Padahal, dalam kesantunan komunikasi Indonesia (high-context), anggukan sering kali bermakna <em>"Saya mendengarkan Anda dengan hormat"</em>, bukan berarti sepakat terhadap butir pasal.`,
    cqScore: 80,
    options: [
      {
        text: 'Mengatakan di depan seluruh forum: "Karena Anda sudah mengangguk, berarti pasal ini kita sahkan sekarang juga."',
        cqImpact: -25,
        cqText: '55 / 100',
        note: 'Kurang tepat. Menodong kepastian secara frontal di depan publik dapat menyebabkan mitra Indonesia "kehilangan muka" (*loss of face*).'
      },
      {
        text: 'Mengabaikan saja dan langsung beralih ke agenda berikutnya tanpa memastikan detail.',
        cqImpact: -10,
        cqText: '70 / 100',
        note: 'Berisiko timbulnya kesalahpahaman implementasi di kemudian hari karena komitmen substantif belum tercapai.'
      },
      {
        text: 'Bertutur santun: "Terima kasih atas penerimaan hangat Bapak/Ibu. Mohon perkenan masukan dan koreksi apakah butir-butir ini sudah selaras dengan harapan institusi Bapak/Ibu."',
        cqImpact: +15,
        cqText: '95 / 100',
        note: 'Sangat piawai! Anda memberikan ruang yang nyaman (*leluasa*) bagi mitra untuk menyampaikan catatan tanpa merasa tertekan, menjunjung tinggi unggah-ungguh diplomasi.'
      }
    ]
  },
  2: {
    category: 'Konteks Negosiasi Bisnis & Startup',
    title: 'Kolaborasi Pengembang Perangkat Lunak Bangalore - Jakarta',
    narrative: `Tim insinyur India terbiasa dengan gaya debat argumentatif yang sangat lugas (*direct & assertive debate*), sedangkan rekan insinyur Indonesia cenderung menjaga keselarasan kelompok (*rukun*) dan jarang membantah secara langsung dalam rapat besar.`,
    cqScore: 75,
    options: [
      {
        text: 'Mendesak tim lokal untuk segera berdebat keras: "Ayo sanggah argumen saya kalau kalian punya ide!"',
        cqImpact: -20,
        cqText: '55 / 100',
        note: 'Cara ini justru mematikan inisiatif karena terkesan konfrontatif bagi kultur kerja Indonesia.'
      },
      {
        text: 'Mengadakan sesi diskusi santai (ngobrol berdua atau coffee-break) untuk mendengarkan masukan mereka secara hangat.',
        cqImpact: +20,
        cqText: '95 / 100',
        note: 'Taktik brilian seorang interpreter & diplomat bisnis! Pendekatan personal (*basa-basi berbobot*) mencairkan sekat hierarki dan menghasilkan kolaborasi tulus.'
      }
    ]
  },
  3: {
    category: 'Konteks Sosial & Diplomasi Kuliner',
    title: 'Jamuan Makan Malam Bersama Keluarga Homestay di Banyuwangi',
    narrative: `Tuan rumah di Banyuwangi menyajikan masakan khas Jawa Timur dengan kehangatan luar biasa. Namun, sebagai tamu yang menghormati pantangan makanan tertentu (misalnya vegetarian murni atau pantangan daging tertentu), Anda harus menolak sebagian hidangan tanpa menyakiti hati tuan rumah.`,
    cqScore: 85,
    options: [
      {
        text: 'Langsung menolak tegas di meja makan: "Maaf, makanan ini tidak sesuai dengan prinsip saya."',
        cqImpact: -30,
        cqText: '55 / 100',
        note: 'Terkesan kaku dan dapat melukai perasaan tuan rumah yang telah mempersiapkan jamuan dengan penuh cinta.'
      },
      {
        text: 'Memuji aromanya dengan tulus, menyantap hidangan sayur/nasi yang diperkenankan dengan lahap, dan menjelaskan pantangan secara santun sambil meminta maaf.',
        cqImpact: +15,
        cqText: '100 / 100',
        note: 'Sempurna! Sikap ini mencerminkan kearifan tepasira Ki Hadjar Dewantara dan kelembutan Gandhi: mengutamakan rasa syukur atas jamuan sebelum menjelaskan batasan personal.'
      }
    ]
  }
};

function loadScenario(num) {
  const scen = scenarios[num];
  if (!scen) return;

  // Active buttons
  [1, 2, 3].forEach(n => {
    const b = document.getElementById(`scenBtn${n}`);
    if (b) {
      if (n === num) {
        b.classList.add('border-saffron', 'ring-2', 'ring-saffron/30');
      } else {
        b.classList.remove('border-saffron', 'ring-2', 'ring-saffron/30');
      }
    }
  });

  document.getElementById('scenCategory').innerText = scen.category;
  document.getElementById('scenTitle').innerText = scen.title;
  document.getElementById('scenNarrative').innerHTML = scen.narrative;
  document.getElementById('cqScoreVal').innerText = `${scen.cqScore} / 100`;
  document.getElementById('cqBar').style.width = `${scen.cqScore}%`;

  const container = document.getElementById('scenOptionsContainer');
  container.innerHTML = '';

  scen.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-saffron cursor-pointer bg-white dark:bg-slate-900 transition-all text-xs flex items-start gap-3';
    div.innerHTML = `
      <span class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5">${String.fromCharCode(65 + idx)}</span>
      <span class="flex-1 text-slate-800 dark:text-slate-200 leading-relaxed">${opt.text}</span>
    `;
    div.onclick = () => {
      // update note
      const noteBox = document.getElementById('interpreterNoteText');
      noteBox.innerHTML = opt.note;

      // update score
      const newScore = Math.max(30, Math.min(100, scen.cqScore + opt.cqImpact));
      document.getElementById('cqScoreVal').innerText = `${newScore} / 100`;
      document.getElementById('cqBar').style.width = `${newScore}%`;

      // highlight choice
      container.querySelectorAll('div').forEach(d => d.classList.remove('ring-2', 'ring-saffron', 'bg-amber-50/50'));
      div.classList.add('ring-2', 'ring-saffron', 'bg-amber-50/50');
    };
    container.appendChild(div);
  });

  document.getElementById('interpreterNoteText').innerText = 'Pilihlah salah satu respons di atas untuk menganalisis dampaknya terhadap skor Cultural Intelligence (CQ) Anda.';
}

// ============================================================================
// 6. POETRY DECLAMATION
// ============================================================================
function readPoemAloud(author) {
  if (!('speechSynthesis' in window)) {
    alert('Browser Anda tidak mendukung pemutar suara SpeechSynthesis.');
    return;
  }

  let text = '';
  if (author === 'tagore') {
    text = "Di mana pikiran tiada gentar dan kepala tegak menengadah. Di mana pengetahuan bebas tanpa sekat pembatas. Ke dalam surga kebebasan itulah jiwaku bangkit.";
  } else if (author === 'pramoedya') {
    text = "Seorang terpelajar harus sudah berbuat adil sejak dalam pikiran, apalagi dalam perbuatan.";
  }

  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'id-ID';
  utt.rate = 0.9; // deliberate poetic pace
  utt.pitch = 0.95;
  window.speechSynthesis.speak(utt);
}

// ============================================================================
// 7. LESSON PLAN MODAL & COLLABORATION FORM
// ============================================================================
function previewLessonPlanModal() {
  const modal = document.getElementById('lessonPlanModal');
  if (modal) modal.classList.remove('hidden');
}

function closeLessonPlanModal() {
  const modal = document.getElementById('lessonPlanModal');
  if (modal) modal.classList.add('hidden');
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const msg = document.getElementById('contactSuccessMsg');

  if (msg) {
    msg.classList.remove('hidden');
    msg.innerHTML = `Terima kasih, <strong>${name}</strong> (${email}). Pesan ketertarikan Anda untuk berkolaborasi dalam riset disertasi Mas Farhan telah terkirim!`;
  }

  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadScenario(1);
});

