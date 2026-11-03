document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const audioContext = window.AudioContext ? new AudioContext() : null;
  let soundEnabled = false;

  function clickSound(frequency = 320) {
    if (!soundEnabled || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .08);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + .08);
  }

  document.querySelectorAll("button, .action, .dock a").forEach(element => {
    element.addEventListener("click", () => clickSound(element.classList.contains("secret") ? 520 : 360));
  });

  const playerToggle = document.getElementById("player-toggle");
  const volume = document.getElementById("volume");
  const coverFile = document.getElementById("cover-file");
  const coverArt = document.getElementById("cover-art");
  const avatarFile = document.getElementById("avatar-file");
  const avatarImage = document.getElementById("avatar-image");
  const avatarLetter = document.getElementById("avatar-letter");

  const soundToggle = document.getElementById("sound-toggle");
  const audioFile = document.getElementById("audio-file");
  const drainYou = document.getElementById("drain-you");

  soundToggle.addEventListener("click", async () => {
    if (!drainYou.src) {
      audioFile.click();
      return;
    }

    if (drainYou.paused) {
      await drainYou.play();
      soundEnabled = true;
      soundToggle.textContent = "Ⅱ";
      soundToggle.setAttribute("aria-pressed", "true");
      soundToggle.setAttribute("aria-label", "Pausar Drain You");
    } else {
      drainYou.pause();
      soundEnabled = false;
      soundToggle.textContent = "▶";
      soundToggle.setAttribute("aria-pressed", "false");
      soundToggle.setAttribute("aria-label", "Reproducir Drain You");
    }
    if (soundEnabled) clickSound();
  });

  audioFile.addEventListener("change", async () => {
    const file = audioFile.files[0];
    if (!file) return;
    if (drainYou.src) URL.revokeObjectURL(drainYou.src);
    drainYou.src = URL.createObjectURL(file);
    drainYou.loop = true;
    try {
      await drainYou.play();
      soundEnabled = true;
      soundToggle.textContent = "Ⅱ";
      soundToggle.setAttribute("aria-pressed", "true");
      soundToggle.setAttribute("aria-label", "Pausar Drain You");
    } catch {
      soundToggle.textContent = "▶";
    }
  });

  playerToggle.addEventListener("click", () => soundToggle.click());
  volume.addEventListener("input", () => drainYou.volume = Number(volume.value));
  drainYou.volume = .7;

  drainYou.addEventListener("play", () => { playerToggle.textContent = "Ⅱ"; playerToggle.setAttribute("aria-label", "Pausar"); });
  drainYou.addEventListener("pause", () => { playerToggle.textContent = "▶"; playerToggle.setAttribute("aria-label", "Reproducir"); });

  document.getElementById("cover-button").addEventListener("click", () => coverFile.click());
  coverFile.addEventListener("change", () => {
    const file = coverFile.files[0];
    if (!file) return;
    coverArt.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
  });
  avatarFile.addEventListener("change", () => {
    const file = avatarFile.files[0];
    if (!file) return;
    avatarImage.src = URL.createObjectURL(file);
    avatarImage.hidden = false;
    avatarLetter.hidden = true;
  });

  setTimeout(() => document.getElementById("boot-screen")?.classList.add("loaded"), 900);

  const secretTrigger = document.getElementById("secret-trigger");
  const secretContent = document.getElementById("secret-content");
  secretTrigger.addEventListener("click", () => {
    const expanded = secretTrigger.getAttribute("aria-expanded") === "true";
    secretTrigger.setAttribute("aria-expanded", String(!expanded));
    secretContent.hidden = expanded;
    secretTrigger.innerHTML = expanded ? "Desbloquear archivo secreto <span>+</span>" : "Ocultar archivo secreto <span>−</span>";
    if (!expanded) secretContent.classList.add("reveal-in");
  });

  let currentSlide = 0;
  const track = document.getElementById("interest-track");
  const slideNumber = document.getElementById("slide-number");
  function moveSlide(direction) {
    currentSlide = (currentSlide + direction + 5) % 5;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    slideNumber.textContent = String(currentSlide + 1).padStart(2, "0");
  }
  document.getElementById("prev-interest").addEventListener("click", () => { moveSlide(-1); clickSound(280); });
  document.getElementById("next-interest").addEventListener("click", () => { moveSlide(1); clickSound(420); });

  const musicArtistsToggle = document.getElementById("music-artists-toggle");
  const musicArtists = document.getElementById("music-artists");
  const closeMusicArtistsButton = document.getElementById("close-music-artists");
  let closeArtistsTimer;

  function closeMusicArtists() {
    if (musicArtists.hidden || musicArtists.classList.contains("is-closing")) return;
    musicArtists.classList.remove("is-open");
    musicArtists.classList.add("is-closing");
    musicArtistsToggle.setAttribute("aria-expanded", "false");
    musicArtistsToggle.setAttribute("aria-label", "Mostrar artistas favoritos");
    document.body.classList.remove("artists-open");
    closeArtistsTimer = setTimeout(() => {
      musicArtists.hidden = true;
      musicArtists.classList.remove("is-closing");
      musicArtistsToggle.focus({ preventScroll: true });
    }, 350);
  }

  musicArtistsToggle.addEventListener("click", () => {
    if (!musicArtists.hidden) return;
    clearTimeout(closeArtistsTimer);
    musicArtists.classList.remove("is-closing");
    musicArtists.hidden = false;
    document.body.classList.add("artists-open");
    musicArtistsToggle.setAttribute("aria-expanded", "true");
    musicArtistsToggle.setAttribute("aria-label", "Ocultar artistas favoritos");
    requestAnimationFrame(() => musicArtists.classList.add("is-open"));
    closeMusicArtistsButton.focus({ preventScroll: true });
  });
  closeMusicArtistsButton.addEventListener("click", closeMusicArtists);
  musicArtists.addEventListener("click", event => {
    if (event.target === musicArtists || event.target.classList.contains("artists-overlay-backdrop")) closeMusicArtists();
  });
  const screenFavoritesToggle = document.getElementById("screen-favorites-toggle");
  const screenFavorites = document.getElementById("screen-favorites");
  const closeScreenFavoritesButton = document.getElementById("close-screen-favorites");
  let closeScreenFavoritesTimer;

  function closeScreenFavorites() {
    if (screenFavorites.hidden || screenFavorites.classList.contains("is-closing")) return;
    screenFavorites.classList.remove("is-open");
    screenFavorites.classList.add("is-closing");
    screenFavoritesToggle.setAttribute("aria-expanded", "false");
    screenFavoritesToggle.setAttribute("aria-label", "Mostrar películas y anime favoritos");
    document.body.classList.remove("artists-open");
    closeScreenFavoritesTimer = setTimeout(() => {
      screenFavorites.hidden = true;
      screenFavorites.classList.remove("is-closing");
      screenFavoritesToggle.focus({ preventScroll: true });
    }, 350);
  }

  screenFavoritesToggle.addEventListener("click", () => {
    if (!screenFavorites.hidden) return;
    clearTimeout(closeScreenFavoritesTimer);
    screenFavorites.classList.remove("is-closing");
    screenFavorites.hidden = false;
    document.body.classList.add("artists-open");
    screenFavoritesToggle.setAttribute("aria-expanded", "true");
    screenFavoritesToggle.setAttribute("aria-label", "Ocultar películas y anime favoritos");
    requestAnimationFrame(() => screenFavorites.classList.add("is-open"));
    closeScreenFavoritesButton.focus({ preventScroll: true });
  });
  closeScreenFavoritesButton.addEventListener("click", closeScreenFavorites);
  screenFavorites.addEventListener("click", event => {
    if (event.target === screenFavorites || event.target.classList.contains("artists-overlay-backdrop")) closeScreenFavorites();
  });
  const gameFavoritesToggle = document.getElementById("game-favorites-toggle");
  const gameFavorites = document.getElementById("game-favorites");
  const closeGameFavoritesButton = document.getElementById("close-game-favorites");
  let closeGameFavoritesTimer;

  function closeGameFavorites() {
    if (gameFavorites.hidden || gameFavorites.classList.contains("is-closing")) return;
    gameFavorites.classList.remove("is-open");
    gameFavorites.classList.add("is-closing");
    gameFavoritesToggle.setAttribute("aria-expanded", "false");
    gameFavoritesToggle.setAttribute("aria-label", "Mostrar videojuegos favoritos");
    document.body.classList.remove("artists-open");
    closeGameFavoritesTimer = setTimeout(() => {
      gameFavorites.hidden = true;
      gameFavorites.classList.remove("is-closing");
      gameFavoritesToggle.focus({ preventScroll: true });
    }, 350);
  }

  gameFavoritesToggle.addEventListener("click", () => {
    if (!gameFavorites.hidden) return;
    clearTimeout(closeGameFavoritesTimer);
    gameFavorites.classList.remove("is-closing");
    gameFavorites.hidden = false;
    document.body.classList.add("artists-open");
    gameFavoritesToggle.setAttribute("aria-expanded", "true");
    gameFavoritesToggle.setAttribute("aria-label", "Ocultar videojuegos favoritos");
    requestAnimationFrame(() => gameFavorites.classList.add("is-open"));
    closeGameFavoritesButton.focus({ preventScroll: true });
  });
  closeGameFavoritesButton.addEventListener("click", closeGameFavorites);
  gameFavorites.addEventListener("click", event => {
    if (event.target === gameFavorites || event.target.classList.contains("artists-overlay-backdrop")) closeGameFavorites();
  });
  const sportFavoritesToggle = document.getElementById("sport-favorites-toggle");
  const sportFavorites = document.getElementById("sport-favorites");
  const closeSportFavoritesButton = document.getElementById("close-sport-favorites");
  let closeSportFavoritesTimer;

  function closeSportFavorites() {
    if (sportFavorites.hidden || sportFavorites.classList.contains("is-closing")) return;
    sportFavorites.classList.remove("is-open");
    sportFavorites.classList.add("is-closing");
    sportFavoritesToggle.setAttribute("aria-expanded", "false");
    sportFavoritesToggle.setAttribute("aria-label", "Mostrar deportes favoritos");
    document.body.classList.remove("artists-open");
    closeSportFavoritesTimer = setTimeout(() => {
      sportFavorites.hidden = true;
      sportFavorites.classList.remove("is-closing");
      sportFavoritesToggle.focus({ preventScroll: true });
    }, 350);
  }

  sportFavoritesToggle.addEventListener("click", () => {
    if (!sportFavorites.hidden) return;
    clearTimeout(closeSportFavoritesTimer);
    sportFavorites.classList.remove("is-closing");
    sportFavorites.hidden = false;
    document.body.classList.add("artists-open");
    sportFavoritesToggle.setAttribute("aria-expanded", "true");
    sportFavoritesToggle.setAttribute("aria-label", "Ocultar deportes favoritos");
    requestAnimationFrame(() => sportFavorites.classList.add("is-open"));
    closeSportFavoritesButton.focus({ preventScroll: true });
  });
  closeSportFavoritesButton.addEventListener("click", closeSportFavorites);
  sportFavorites.addEventListener("click", event => {
    if (event.target === sportFavorites || event.target.classList.contains("artists-overlay-backdrop")) closeSportFavorites();
  });
  const foodFavoritesToggle = document.getElementById("food-favorites-toggle");
  const foodFavorites = document.getElementById("food-favorites");
  const closeFoodFavoritesButton = document.getElementById("close-food-favorites");
  let closeFoodFavoritesTimer;

  function closeFoodFavorites() {
    if (foodFavorites.hidden || foodFavorites.classList.contains("is-closing")) return;
    foodFavorites.classList.remove("is-open");
    foodFavorites.classList.add("is-closing");
    foodFavoritesToggle.setAttribute("aria-expanded", "false");
    foodFavoritesToggle.setAttribute("aria-label", "Mostrar comidas favoritas");
    document.body.classList.remove("artists-open");
    closeFoodFavoritesTimer = setTimeout(() => {
      foodFavorites.hidden = true;
      foodFavorites.classList.remove("is-closing");
      foodFavoritesToggle.focus({ preventScroll: true });
    }, 350);
  }

  foodFavoritesToggle.addEventListener("click", () => {
    if (!foodFavorites.hidden) return;
    clearTimeout(closeFoodFavoritesTimer);
    foodFavorites.classList.remove("is-closing");
    foodFavorites.hidden = false;
    document.body.classList.add("artists-open");
    foodFavoritesToggle.setAttribute("aria-expanded", "true");
    foodFavoritesToggle.setAttribute("aria-label", "Ocultar comidas favoritas");
    requestAnimationFrame(() => foodFavorites.classList.add("is-open"));
    closeFoodFavoritesButton.focus({ preventScroll: true });
  });
  closeFoodFavoritesButton.addEventListener("click", closeFoodFavorites);
  foodFavorites.addEventListener("click", event => {
    if (event.target === foodFavorites || event.target.classList.contains("artists-overlay-backdrop")) closeFoodFavorites();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (!musicArtists.hidden) closeMusicArtists();
    if (!screenFavorites.hidden) closeScreenFavorites();
    if (!gameFavorites.hidden) closeGameFavorites();
    if (!sportFavorites.hidden) closeSportFavorites();
    if (!foodFavorites.hidden) closeFoodFavorites();
  });

  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const start = performance.now();
      const duration = 900;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      }
      if (!reduceMotion) requestAnimationFrame(tick); else element.textContent = target;
      counterObserver.unobserve(element);
    });
  }, { threshold: .7 });
  counters.forEach(counter => counterObserver.observe(counter));

  if (!reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.removeProperty("--card-x");
        card.style.removeProperty("--card-y");
      });
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".dock a")];
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle("active", link.dataset.section === entry.target.id));
    });
  }, { threshold: .45 }).observe(sections[0]);
  sections.forEach(section => {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle("active", link.dataset.section === section.id));
      });
    }, { threshold: .45 }).observe(section);
  });

  const progress = document.getElementById("scroll-progress");
  addEventListener("scroll", () => {
    const amount = scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    progress.style.width = `${Math.min(amount, 1) * 100}%`;
  }, { passive: true });

  addEventListener("pointermove", event => {
    document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
  }, { passive: true });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll(".panel, .interest, .skill-row, .memory-card, .drive-card").forEach((element, index) => {
    element.style.animationDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });

  const canvas = document.getElementById("particles");
  const context = canvas.getContext("2d");
  let stars = [];
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    stars = Array.from({ length: Math.min(70, Math.floor(innerWidth / 18)) }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.2 + .2, speed: Math.random() * .12 + .03, alpha: Math.random() * .5 + .15
    }));
  }
  function animateParticles() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    stars.forEach(star => {
      star.y -= star.speed;
      if (star.y < -2) star.y = innerHeight + 2;
      context.fillStyle = `rgba(216,255,62,${star.alpha})`;
      context.beginPath(); context.arc(star.x, star.y, star.r, 0, Math.PI * 2); context.fill();
    });
    if (!reduceMotion) requestAnimationFrame(animateParticles);
  }
  if (!reduceMotion) { resize(); animateParticles(); addEventListener("resize", resize); }
});