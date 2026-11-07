/**
 * MUHAMMAD ZIDANE - ELECTRICAL ENGINEERING & ROBOTICS PORTFOLIO
 * High-Interactivity Script: Dark/Light Mode, Robot Diagnostics, Audio FX, Modals
 */

// -----------------------------------------------------------------------------
// 1. SOUND FX SYSTEM (Synthesized with Web Audio API - Zero Dependencies)
// -----------------------------------------------------------------------------
let audioCtx = null;
let isSoundEnabled = localStorage.getItem('sound_enabled') === 'true';

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.04) {
  if (!isSoundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.debug('Audio blip suppressed:', err);
  }
}

function playTechBeep(action = 'click') {
  if (!isSoundEnabled) return;
  if (action === 'click') {
    playTone(587.33, 'sine', 0.05, 0.03); // D5
  } else if (action === 'toggle') {
    playTone(440, 'triangle', 0.06, 0.03);
    setTimeout(() => playTone(659.25, 'sine', 0.08, 0.03), 50);
  } else if (action === 'scan') {
    playTone(329.63, 'sawtooth', 0.07, 0.02);
    setTimeout(() => playTone(523.25, 'sine', 0.1, 0.03), 80);
    setTimeout(() => playTone(880, 'sine', 0.12, 0.03), 160);
  } else if (action === 'success') {
    playTone(523.25, 'sine', 0.08, 0.03);
    setTimeout(() => playTone(659.25, 'sine', 0.08, 0.03), 80);
    setTimeout(() => playTone(1046.50, 'sine', 0.15, 0.04), 160);
  }
}

// -----------------------------------------------------------------------------
// 2. TOAST NOTIFICATION SYSTEM
// -----------------------------------------------------------------------------
const toastEl = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
let toastTimer = null;

function showToast(message) {
  if (!toastEl || !toastText) return;
  toastText.textContent = message;
  toastEl.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2800);
}

// -----------------------------------------------------------------------------
// 3. THEME SYSTEM: DARK & LIGHT MODE ("pengaturan mode putih dan hitam")
// -----------------------------------------------------------------------------
const themeToggleBtn = document.getElementById('theme-toggle');
const floatingThemeBtn = document.getElementById('btn-floating-theme');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');
const themeText = document.querySelector('.theme-text');
const metaThemeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, notify = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    if (iconSun) iconSun.style.display = 'none';
    if (iconMoon) iconMoon.style.display = 'inline-block';
    if (themeText) themeText.textContent = 'Dark';
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#070b12');
    if (notify) showToast('🌙 Mode Gelap (Cyber Dark) diaktifkan');
  } else {
    if (iconSun) iconSun.style.display = 'inline-block';
    if (iconMoon) iconMoon.style.display = 'none';
    if (themeText) themeText.textContent = 'Light';
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8fafc');
    if (notify) showToast('☀️ Mode Terang (Clean White) diaktifkan');
  }
  playTechBeep('toggle');
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme, false);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}

if (floatingThemeBtn) {
  floatingThemeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}

// -----------------------------------------------------------------------------
// 4. SOUND TOGGLE BUTTON
// -----------------------------------------------------------------------------
const soundToggleBtn = document.getElementById('sound-toggle');
const iconSoundOff = document.querySelector('.icon-sound-off');
const iconSoundOn = document.querySelector('.icon-sound-on');

function updateSoundUI() {
  if (iconSoundOff && iconSoundOn) {
    if (isSoundEnabled) {
      iconSoundOff.style.display = 'none';
      iconSoundOn.style.display = 'inline-block';
    } else {
      iconSoundOff.style.display = 'inline-block';
      iconSoundOn.style.display = 'none';
    }
  }
}
updateSoundUI();

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    initAudioContext();
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('sound_enabled', String(isSoundEnabled));
    updateSoundUI();
    if (isSoundEnabled) {
      playTone(659.25, 'sine', 0.1, 0.05);
      showToast('🔊 Efek suara diaktifkan');
    } else {
      showToast('🔇 Efek suara dimatikan');
    }
  });
}

// -----------------------------------------------------------------------------
// 5. MOBILE NAVIGATION DRAWER
// -----------------------------------------------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
    playTechBeep('click');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      playTechBeep('click');
    });
  });
}

// -----------------------------------------------------------------------------
// 6. INTERACTIVE HERO ROBOT WORKBENCH & LAB CONTROLS
// -----------------------------------------------------------------------------
const interactiveCard = document.getElementById('interactive-lab-card');
const robotAvatar = document.getElementById('robot-avatar');
const robotModeLabel = document.getElementById('robot-mode-label');
const hudBattery = document.getElementById('hud-battery');
const hudImu = document.getElementById('hud-imu');
const hudTemp = document.getElementById('hud-temp');

const btnScanRadar = document.getElementById('btn-scan-radar');
const btnToggleMode = document.getElementById('btn-toggle-mode');
const btnCycleColor = document.getElementById('btn-cycle-color');
const heroBtnDemo = document.getElementById('hero-btn-demo');

// Robot Modes
const robotModes = [
  'MODE: AUTONOMOUS',
  'MODE: TELE-OP (REMOTE)',
  'MODE: KRAI SPEED COMBAT',
  'MODE: SENSOR DIAGNOSTIC'
];
let currentModeIdx = 0;

// Robot LED Colors
const ledColorClasses = ['robot-glow-cyan', 'robot-glow-purple', 'robot-glow-emerald', 'robot-glow-amber'];
let currentColorIdx = 0;

if (interactiveCard) {
  interactiveCard.classList.add(ledColorClasses[0]);
}

// 1. Scan Radar Button
if (btnScanRadar) {
  btnScanRadar.addEventListener('click', () => {
    playTechBeep('scan');
    btnScanRadar.classList.add('active');
    
    // Animate robot
    if (robotAvatar) {
      robotAvatar.style.transform = 'scale(1.06) translateY(-4px)';
      setTimeout(() => { robotAvatar.style.transform = 'scale(1) translateY(0)'; }, 350);
    }

    if (hudImu) {
      hudImu.textContent = 'SCANNING 360° LIDAR...';
      hudImu.style.color = 'var(--accent-cyan)';
    }

    showToast('📡 Radar Scan: 360° Field clear. Path optimized.');

    setTimeout(() => {
      if (hudImu) {
        hudImu.textContent = 'CALIBRATED (0.01°)';
      }
      btnScanRadar.classList.remove('active');
    }, 1200);
  });
}

// 2. Toggle Mode Button
if (btnToggleMode) {
  btnToggleMode.addEventListener('click', () => {
    playTechBeep('toggle');
    currentModeIdx = (currentModeIdx + 1) % robotModes.length;
    const nextMode = robotModes[currentModeIdx];

    if (robotModeLabel) {
      robotModeLabel.textContent = nextMode;
    }
    showToast(`🤖 Robot Mode: ${nextMode.replace('MODE: ', '')}`);
  });
}

// 3. Cycle LED Glow Color
if (btnCycleColor) {
  btnCycleColor.addEventListener('click', () => {
    playTechBeep('click');
    if (!interactiveCard) return;

    interactiveCard.classList.remove(...ledColorClasses);
    currentColorIdx = (currentColorIdx + 1) % ledColorClasses.length;
    const newColor = ledColorClasses[currentColorIdx];
    interactiveCard.classList.add(newColor);

    const colorNames = ['Cyan Elektrik', 'Neon Violet', 'Emerald Green', 'Golden Amber'];
    showToast(`🎨 LED Robot: ${colorNames[currentColorIdx]}`);
  });
}

// 4. Hero Diagnostic Button
if (heroBtnDemo) {
  heroBtnDemo.addEventListener('click', () => {
    playTechBeep('scan');
    showToast('⚡ Menjalankan Full Self-Diagnostic ESP32 & ROS 2...');

    if (robotAvatar) {
      robotAvatar.style.transform = 'scale(1.08) rotate(3deg)';
      setTimeout(() => { robotAvatar.style.transform = 'scale(1) rotate(0deg)'; }, 400);
    }

    if (hudBattery) hudBattery.textContent = '12.6V [TESTING LOAD]';
    if (hudTemp) hudTemp.textContent = '35.8 °C';

    setTimeout(() => {
      if (hudBattery) hudBattery.textContent = '12.6V [98% OK]';
      if (hudTemp) hudTemp.textContent = '34.2 °C';
      playTechBeep('success');
      showToast('✓ Diagnostik Selesai: Seluruh Subsistem Normal.');
    }, 1000);
  });
}

// Periodic realistic subtle telemetry variance
setInterval(() => {
  if (hudTemp) {
    const temp = (34.0 + Math.random() * 0.6).toFixed(1);
    hudTemp.textContent = `${temp} °C`;
  }
  const airVal = document.getElementById('air-reading-val');
  if (airVal) {
    const pm = (18.1 + Math.random() * 0.7).toFixed(1);
    airVal.textContent = pm;
  }
}, 4000);

// -----------------------------------------------------------------------------
// 7. SKILL CATEGORY FILTERING
// -----------------------------------------------------------------------------
const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
const skillCards = document.querySelectorAll('.skill-card');

skillTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    playTechBeep('click');
    const filter = btn.dataset.skillFilter;
    skillTabBtns.forEach((b) => b.classList.toggle('active', b === btn));

    skillCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? 'flex' : 'none';
    });
  });
});

// -----------------------------------------------------------------------------
// 8. PROJECT CATEGORY FILTERING
// -----------------------------------------------------------------------------
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    playTechBeep('click');
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// -----------------------------------------------------------------------------
// 9. ONE-CLICK EMAIL COPY & SOCIAL BUTTONS
// -----------------------------------------------------------------------------
const copyEmailBtn = document.getElementById('btn-copy-email');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const emailToCopy = 'zidane.politeknik@gmail.com';
    navigator.clipboard.writeText(emailToCopy)
      .then(() => {
        playTechBeep('success');
        showToast('✓ Email berhasil disalin: ' + emailToCopy);
      })
      .catch(() => {
        showToast('Email: ' + emailToCopy);
      });
  });
}

// -----------------------------------------------------------------------------
// 10. MODAL: PROJECT SPECS POPUP
// -----------------------------------------------------------------------------
const specsModal = document.getElementById('specs-modal');
const modalSpecBadge = document.getElementById('modal-spec-badge');
const modalSpecTitle = document.getElementById('modal-spec-title');
const modalSpecDesc = document.getElementById('modal-spec-desc');
const modalSpecGrid = document.getElementById('modal-spec-grid');

const projectSpecsData = {
  airshield: {
    badge: 'IOT · AIR QUALITY & FILTRATION',
    title: 'AIRSHIELD Smart Indoor Air Protection',
    desc: 'Sistem cerdas pemantauan kualitas udara dan filtrasi otomatis berkecepatan dinamis (PWM) berbasis laser scattering sensor untuk menjaga lingkungan ruangan sehat.',
    specs: [
      { key: 'Microcontroller', val: 'ESP32-WROOM-32D (240MHz Dual Core)' },
      { key: 'Particulate Sensor', val: 'Plantower PMS5003 (Laser PM1.0, PM2.5, PM10)' },
      { key: 'Filtration Control', val: 'MOSFET PWM DC Fan Control & True HEPA Filter' },
      { key: 'Communication', val: 'Wi-Fi 802.11 b/g/n, MQTT Protocol, WebSocket' },
      { key: 'Display & Interface', val: '0.96" OLED I2C Display & Responsive Web GUI' },
      { key: 'Power Supply', val: '12V DC input with Buck Converter step-down 5V/3.3V' }
    ]
  },
  krai: {
    badge: 'ROBOTICS · COMPETITION PLATFORM',
    title: 'Mobile Robotics Platform (KRAI 2027)',
    desc: 'Platform robot otonom dan tele-operasi dengan penggerak omnidirectional tiga roda, sistem pengereman aktif, serta integrasi simulasi virtual sebelum implementasi fisik.',
    specs: [
      { key: 'Robotics Framework', val: 'ROS 2 Humble Hawksbill on Ubuntu 22.04 LTS' },
      { key: 'Motor & Actuators', val: 'High-Torque Planetary DC Motors with Optical Encoders' },
      { key: 'Motion Control', val: 'Closed-Loop PID Velocity Control on ESP32 Microcontroller' },
      { key: 'Simulation Stack', val: 'Gazebo Fortress with URDF Robot Kinematic Models' },
      { key: 'Sensors Array', val: 'MPU6050 6-Axis IMU, Rotary Encoders, Limit Switches' },
      { key: 'Communication Bus', val: 'UART / CAN Bus protocol between master and motor nodes' }
    ]
  },
  ecowast: {
    badge: 'IOT · WATER QUALITY MONITORING',
    title: 'ECOWAST Smart Wastewater Telemetry',
    desc: 'Sistem pengujian parameter kualitas air secara kontinu untuk memverifikasi tingkat pH, kekeruhan partikel, dan stabilitas suhu cairan sebelum dialirkan ke lingkungan.',
    specs: [
      { key: 'Control Core', val: 'Arduino Uno / Nano + ESP32 Gateway' },
      { key: 'Sensing Units', val: 'Analog pH Probe Sensor Kit + Turbidity Optical Sensor' },
      { key: 'Telemetry Cloud', val: 'Firebase Realtime Database & REST API Endpoint' },
      { key: 'Sampling Interval', val: 'Configurable from 1s to 60s with local EEPROM buffer' },
      { key: 'Power Design', val: 'Battery-powered with Solar Panel Li-ion charge management' },
      { key: 'Enclosure', val: 'IP65 Water-Resistant 3D Printed Housing' }
    ]
  }
};

window.openSpecsModal = function(projectId) {
  playTechBeep('click');
  const data = projectSpecsData[projectId];
  if (!data || !specsModal) return;

  modalSpecBadge.textContent = data.badge;
  modalSpecTitle.textContent = data.title;
  modalSpecDesc.textContent = data.desc;

  modalSpecGrid.innerHTML = data.specs.map(s => `
    <div class="modal-spec-item">
      <strong>${s.key}</strong>
      <span>${s.val}</span>
    </div>
  `).join('');

  specsModal.classList.add('open');
  specsModal.setAttribute('aria-hidden', 'false');
};

window.closeSpecsModal = function() {
  playTechBeep('click');
  if (specsModal) {
    specsModal.classList.remove('open');
    specsModal.setAttribute('aria-hidden', 'true');
  }
};

if (specsModal) {
  specsModal.addEventListener('click', (e) => {
    if (e.target === specsModal) closeSpecsModal();
  });
}

// -----------------------------------------------------------------------------
// 11. MODAL: RESUME / CV
// -----------------------------------------------------------------------------
const resumeModal = document.getElementById('resume-modal');
const btnOpenResume = document.getElementById('btn-open-resume');
const heroBtnResume = document.getElementById('hero-btn-resume');
const aboutBtnSpecs = document.getElementById('about-btn-specs');

function openResumeModal() {
  playTechBeep('click');
  if (resumeModal) {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
  }
}

window.closeResumeModal = function() {
  playTechBeep('click');
  if (resumeModal) {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
  }
};

if (btnOpenResume) btnOpenResume.addEventListener('click', openResumeModal);
if (heroBtnResume) heroBtnResume.addEventListener('click', openResumeModal);
if (aboutBtnSpecs) aboutBtnSpecs.addEventListener('click', openResumeModal);

if (resumeModal) {
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });
}

window.downloadResume = function() {
  playTechBeep('success');
  showToast('📥 Mengunduh Dokumen CV Muhammad Zidane...');
  setTimeout(() => {
    window.print();
  }, 500);
};

// Global escape key listener for modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSpecsModal();
    closeResumeModal();
  }
});

// -----------------------------------------------------------------------------
// 12. INTERACTIVE CONTACT FORM SUBMISSION
// -----------------------------------------------------------------------------
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('sender-name')?.value || '';
  const email = document.getElementById('sender-email')?.value || '';
  const topic = document.getElementById('sender-topic')?.value || '';
  const submitBtn = document.getElementById('btn-submit-message');
  const feedback = document.getElementById('form-feedback');

  if (submitBtn) {
    submitBtn.innerHTML = '<span>Mengirimkan Pesan... ⏳</span>';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    playTechBeep('success');
    if (feedback) {
      feedback.classList.add('success');
      feedback.textContent = `✓ Terima kasih ${name}! Pesan mengenai "${topic}" telah terkirim. Zidane akan segera merespon ke ${email}.`;
    }
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Pesan Terkirim! ✓</span>';
    }
    showToast('🚀 Pesan Anda berhasil dikirim ke Muhammad Zidane!');

    setTimeout(() => {
      document.getElementById('contact-form')?.reset();
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Kirim Pesan Sekarang 🚀</span>';
        submitBtn.disabled = false;
      }
    }, 4000);
  }, 1000);
};

// -----------------------------------------------------------------------------
// 13. FLOATING DOCK: BACK TO TOP BUTTON
// -----------------------------------------------------------------------------
const backToTopBtn = document.getElementById('btn-back-to-top');

window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
}, { passive: true });

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    playTechBeep('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// -----------------------------------------------------------------------------
// 14. INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
// -----------------------------------------------------------------------------
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// -----------------------------------------------------------------------------
// 15. CURSOR GLOW FOR DESKTOP
// -----------------------------------------------------------------------------
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }, { passive: true });
  } else {
    cursorGlow.remove();
  }
}

// -----------------------------------------------------------------------------
// 16. CURRENT YEAR IN FOOTER
// -----------------------------------------------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
