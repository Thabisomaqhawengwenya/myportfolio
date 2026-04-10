const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const themeToggle = document.querySelector("#theme-toggle");
const sections = document.querySelectorAll("main section[id], header[id]");
const revealItems = document.querySelectorAll(".reveal");
const backToTopButton = document.querySelector(".back-to-top");
const contactForm = document.querySelector(".contact-form");
const portfolioIntro = document.querySelector("#portfolio-intro");
const introVideo = document.querySelector("#intro-video");
const introSkipButton = document.querySelector("#intro-skip");
const heroCopy = document.querySelector(".hero-copy");
const heroVisual = document.querySelector(".hero-ufo-visual");
const backgroundVideo = document.querySelector("#background-video");
const heroUfoStage = document.querySelector("#hero-ufo-stage");
const heroUfoCanvas = document.querySelector("#hero-ufo-canvas");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const projectModals = document.querySelectorAll(".project-modal");
let activeModal = null;
let lastFocusedTrigger = null;
const INTRO_START_TIME = 0.5;
const INTRO_END_TIME = 3.9;
const rootElement = document.documentElement;
let introSafetyTimer = null;

const getCurrentTheme = () => (rootElement.dataset.theme === "light" ? "light" : "dark");

const syncThemeToggle = () => {
  if (!themeToggle) {
    return;
  }

  const isLightTheme = getCurrentTheme() === "light";
  themeToggle.setAttribute("aria-pressed", String(isLightTheme));
  themeToggle.setAttribute("aria-label", isLightTheme ? "Switch to dark theme" : "Switch to light theme");
};

const setTheme = (theme) => {
  rootElement.dataset.theme = theme;

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (_error) {
    // Ignore storage issues and still apply the theme for this session.
  }

  syncThemeToggle();
};

syncThemeToggle();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "light" ? "dark" : "light";
    setTheme(nextTheme);
  });
}

const isIntroVisible = () =>
  Boolean(portfolioIntro) && !portfolioIntro.hidden && !portfolioIntro.classList.contains("is-hidden");

const dismissIntro = () => {
  if (introSafetyTimer) {
    window.clearTimeout(introSafetyTimer);
    introSafetyTimer = null;
  }

  if (!portfolioIntro || portfolioIntro.classList.contains("is-hidden")) {
    document.body.classList.remove("intro-open");
    return;
  }

  portfolioIntro.classList.add("is-hidden");
  document.body.classList.remove("intro-open");
  document.body.classList.add("intro-complete");
  heroCopy?.classList.add("hero-pan-in");
  heroVisual?.classList.add("hero-pan-in");

  window.setTimeout(() => {
    portfolioIntro.hidden = true;
  }, 560);
};

if (portfolioIntro && introVideo) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    portfolioIntro.hidden = true;
    document.body.classList.remove("intro-open");
  } else {
    document.body.classList.add("intro-open");
    introSafetyTimer = window.setTimeout(() => {
      if (isIntroVisible()) {
        introVideo.pause();
        dismissIntro();
      }
    }, 6000);

    const getIntroStopTime = () => {
      if (!Number.isFinite(introVideo.duration) || introVideo.duration <= 0) {
        return INTRO_END_TIME;
      }

      return Math.min(INTRO_END_TIME, Math.max(INTRO_START_TIME, introVideo.duration));
    };

    const seekIntroStart = () => {
      if (introVideo.currentTime < INTRO_START_TIME || introVideo.currentTime >= getIntroStopTime()) {
        try {
          introVideo.currentTime = INTRO_START_TIME;
        } catch (_error) {
          // Some browsers can briefly block seeking until metadata is fully ready.
        }
      }
    };

    const playIntroVideo = () => {
      introVideo.muted = true;
      introVideo.defaultMuted = true;
      seekIntroStart();

      const playPromise = introVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // The skip button remains available if autoplay is blocked.
        });
      }
    };

    if (introVideo.readyState >= 1) {
      seekIntroStart();
    } else {
      introVideo.addEventListener("loadedmetadata", seekIntroStart, { once: true });
    }

    if (introVideo.readyState >= 2) {
      playIntroVideo();
    } else {
      introVideo.addEventListener("canplay", playIntroVideo, { once: true });
    }

    introVideo.addEventListener("timeupdate", () => {
      if (introVideo.currentTime >= getIntroStopTime()) {
        introVideo.pause();
        dismissIntro();
      }
    });

    introVideo.addEventListener("ended", dismissIntro, { once: true });
    introVideo.addEventListener("error", dismissIntro, { once: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && isIntroVisible() && introVideo.paused) {
        playIntroVideo();
      }
    });
  }
}

if (introSkipButton) {
  introSkipButton.addEventListener("click", () => {
    if (introVideo) {
      introVideo.pause();
    }

    dismissIntro();
  });
};

const closeMobileMenu = () => {
  if (!navToggle || !siteNav) {
    return;
  }

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    link.classList.toggle("is-active", target === `#${id}`);
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -28px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-12% 0px -48% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const toggleBackToTop = () => {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.classList.toggle("is-visible", window.scrollY > 420);
};

toggleBackToTop();
window.addEventListener("scroll", toggleBackToTop, { passive: true });

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (backgroundVideo) {
  const tryPlayBackgroundVideo = () => {
    backgroundVideo.muted = true;
    backgroundVideo.defaultMuted = true;

    const playPromise = backgroundVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // If autoplay is blocked or the codec is unsupported, the page still falls back gracefully.
      });
    }
  };

  if (backgroundVideo.readyState >= 2) {
    tryPlayBackgroundVideo();
  } else {
    backgroundVideo.addEventListener("canplay", tryPlayBackgroundVideo, { once: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && backgroundVideo.paused) {
      tryPlayBackgroundVideo();
    }
  });
}

if (heroUfoStage && heroUfoCanvas && window.THREE) {
  try {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({
      canvas: heroUfoCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if ("toneMapping" in renderer && "ACESFilmicToneMapping" in THREE) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
    }
    if ("outputEncoding" in renderer && "sRGBEncoding" in THREE) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    camera.position.set(0, 1.7, 18);
    camera.lookAt(0, -2.6, 0);

    scene.add(new THREE.AmbientLight(0xc8ecff, 0.85));

    const hemisphereLight = new THREE.HemisphereLight(0xe0f7ff, 0x060b15, 1.2);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
    keyLight.position.set(-5.8, 6.8, 8.6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7adbff, 1.05);
    rimLight.position.set(6.4, 2.6, -5.4);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0x57dcff, 2.1, 34);
    topLight.position.set(0, 3.1, 7.2);
    scene.add(topLight);

    const undersideLight = new THREE.PointLight(0x57dcff, 1.8, 24);
    undersideLight.position.set(0, -1.15, 1.6);
    scene.add(undersideLight);

    const beamLight = new THREE.PointLight(0xaef6ff, 2.8, 30);
    beamLight.position.set(0, -4.9, 1.1);
    scene.add(beamLight);

    const hoverRig = new THREE.Group();
    const ufoGroup = new THREE.Group();
    hoverRig.position.y = 0.55;
    ufoGroup.rotation.x = 0.16;
    hoverRig.add(ufoGroup);
    scene.add(hoverRig);

    const hullMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x67707d,
      metalness: 1,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.11,
      reflectivity: 1,
      emissive: 0x050a12,
      emissiveIntensity: 0.12,
    });

    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x424d5f,
      metalness: 1,
      roughness: 0.32,
      clearcoat: 0.75,
      clearcoatRoughness: 0.16,
      emissive: 0x081329,
      emissiveIntensity: 0.22,
    });

    const domeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x99b0c8,
      metalness: 0.18,
      roughness: 0.16,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x0f2b4c,
      emissiveIntensity: 0.22,
    });

    const glowRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x57dcff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    const beamCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5feff,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0x8deeff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    const beamOuterMaterial = new THREE.MeshBasicMaterial({
      color: 0x57dcff,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    const hullProfile = [
      new THREE.Vector2(0.12, 1.05),
      new THREE.Vector2(0.42, 1.18),
      new THREE.Vector2(0.92, 1.28),
      new THREE.Vector2(1.85, 1.28),
      new THREE.Vector2(3.05, 1.15),
      new THREE.Vector2(4.42, 0.84),
      new THREE.Vector2(5.38, 0.45),
      new THREE.Vector2(5.9, 0.12),
      new THREE.Vector2(6.02, -0.03),
      new THREE.Vector2(5.84, -0.16),
      new THREE.Vector2(5.18, -0.34),
      new THREE.Vector2(4.26, -0.55),
      new THREE.Vector2(3.08, -0.81),
      new THREE.Vector2(1.72, -1.03),
      new THREE.Vector2(0.68, -1.16),
      new THREE.Vector2(0.16, -1.14),
    ];

    const hull = new THREE.Mesh(new THREE.LatheGeometry(hullProfile, 128), hullMaterial);
    hull.scale.set(0.82, 0.82, 0.82);
    ufoGroup.add(hull);

    const undersidePlate = new THREE.Mesh(new THREE.CylinderGeometry(3.92, 4.08, 0.42, 96), rimMaterial);
    undersidePlate.position.y = -0.95;
    ufoGroup.add(undersidePlate);

    const undersideDish = new THREE.Mesh(new THREE.SphereGeometry(2.55, 48, 28), rimMaterial);
    undersideDish.scale.set(1, 0.16, 1);
    undersideDish.position.y = -1.2;
    ufoGroup.add(undersideDish);

    const beamSocket = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.18, 0.24, 72), rimMaterial);
    beamSocket.position.y = -1.33;
    ufoGroup.add(beamSocket);

    const outerRim = new THREE.Mesh(new THREE.TorusGeometry(4.75, 0.12, 18, 120), rimMaterial);
    outerRim.rotation.x = Math.PI / 2;
    outerRim.position.y = -0.26;
    ufoGroup.add(outerRim);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.78, 52, 32), domeMaterial);
    dome.scale.set(1, 0.46, 1);
    dome.position.y = 1.22;
    ufoGroup.add(dome);

    const topHalo = new THREE.Mesh(new THREE.TorusGeometry(1.92, 0.06, 18, 110), glowRingMaterial);
    topHalo.rotation.x = Math.PI / 2;
    topHalo.position.y = 1.14;
    ufoGroup.add(topHalo);

    const undersideGlowRing = new THREE.Mesh(new THREE.TorusGeometry(3.92, 0.12, 18, 120), glowRingMaterial);
    undersideGlowRing.rotation.x = Math.PI / 2;
    undersideGlowRing.position.y = -0.92;
    ufoGroup.add(undersideGlowRing);

    const beamRing = new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.12, 18, 100), glowRingMaterial);
    beamRing.rotation.x = Math.PI / 2;
    beamRing.position.y = -1.37;
    ufoGroup.add(beamRing);

    const innerBeamRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.05, 14, 72), glowRingMaterial);
    innerBeamRing.rotation.x = Math.PI / 2;
    innerBeamRing.position.y = -1.39;
    ufoGroup.add(innerBeamRing);

    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 1.16, 7.6, 56, 1, true), beamCoreMaterial);
    beam.position.y = -5.1;
    ufoGroup.add(beam);

    const beamMid = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 1.86, 8.2, 56, 1, true), beamMaterial);
    beamMid.position.y = -5.2;
    ufoGroup.add(beamMid);

    const beamOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 2.7, 8.8, 56, 1, true), beamOuterMaterial);
    beamOuter.position.y = -5.3;
    ufoGroup.add(beamOuter);

    const groundGlow = new THREE.Mesh(
      new THREE.CircleGeometry(2.28, 64),
      new THREE.MeshBasicMaterial({
        color: 0xaef6ff,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })
    );
    groundGlow.rotation.x = -Math.PI / 2;
    groundGlow.position.y = -9;
    scene.add(groundGlow);

    const groundRing = new THREE.Mesh(
      new THREE.RingGeometry(1.45, 2.7, 64),
      new THREE.MeshBasicMaterial({
        color: 0x57dcff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })
    );
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = -8.98;
    scene.add(groundRing);

    const undersideLightMaterials = [];
    const undersideLights = new THREE.Group();
    for (let index = 0; index < 28; index += 1) {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xc4fbff,
          emissive: 0x57dcff,
          emissiveIntensity: 1.55,
          roughness: 0.2,
          metalness: 0.04,
        })
      );
      const angle = (index / 28) * Math.PI * 2;
      bulb.scale.set(0.9, 1.35, 1);
      bulb.position.set(Math.cos(angle) * 4.15, -0.86, Math.sin(angle) * 4.15);
      undersideLights.add(bulb);
      undersideLightMaterials.push({
        material: bulb.material,
        phase: index * 0.35,
      });
    }
    ufoGroup.add(undersideLights);

    const edgeLightMaterials = [];
    const edgeLights = new THREE.Group();
    for (let index = 0; index < 18; index += 1) {
      const edgeLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 10, 10),
        new THREE.MeshStandardMaterial({
          color: 0xb8f8ff,
          emissive: 0x57dcff,
          emissiveIntensity: 1.15,
          roughness: 0.24,
          metalness: 0.06,
        })
      );
      const angle = (index / 18) * Math.PI * 2;
      edgeLight.position.set(Math.cos(angle) * 5.32, -0.28, Math.sin(angle) * 5.32);
      edgeLights.add(edgeLight);
      edgeLightMaterials.push({
        material: edgeLight.material,
        phase: index * 0.52,
      });
    }
    ufoGroup.add(edgeLights);

    const beamParticleGeometry = new THREE.BufferGeometry();
    const beamParticleCount = 70;
    const beamParticlePositions = new Float32Array(beamParticleCount * 3);
    const beamParticleSeeds = [];

    for (let index = 0; index < beamParticleCount; index += 1) {
      const seed = {
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 0.42,
        speed: 0.24 + Math.random() * 0.34,
        offset: Math.random(),
      };
      beamParticleSeeds.push(seed);
      beamParticlePositions[index * 3] = Math.cos(seed.angle) * seed.radius;
      beamParticlePositions[index * 3 + 1] = -2 - seed.offset * 6.2;
      beamParticlePositions[index * 3 + 2] = Math.sin(seed.angle) * seed.radius;
    }

    beamParticleGeometry.setAttribute("position", new THREE.BufferAttribute(beamParticlePositions, 3));

    const beamParticles = new THREE.Points(
      beamParticleGeometry,
      new THREE.PointsMaterial({
        color: 0xe6fdff,
        size: 0.09,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      })
    );
    beamParticles.position.y = -0.2;
    ufoGroup.add(beamParticles);

    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const updatePointerTarget = (event) => {
      const bounds = heroUfoStage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) {
        return;
      }

      targetPointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetPointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    heroUfoStage.addEventListener("pointermove", updatePointerTarget);
    heroUfoStage.addEventListener("pointerleave", () => {
      targetPointerX = 0;
      targetPointerY = 0;
    });

    const resizeHeroUfoScene = () => {
      const width = heroUfoStage.clientWidth;
      const height = heroUfoStage.clientHeight;

      if (!width || !height) {
        return;
      }

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resizeHeroUfoScene();
    heroUfoStage.classList.add("is-ready");

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        resizeHeroUfoScene();
      });
      resizeObserver.observe(heroUfoStage);
    } else {
      window.addEventListener("resize", resizeHeroUfoScene);
    }

    const clock = new THREE.Clock();

    const renderUfoScene = () => {
      const elapsed = clock.getElapsedTime();

      currentPointerX += (targetPointerX - currentPointerX) * 0.045;
      currentPointerY += (targetPointerY - currentPointerY) * 0.045;

      hoverRig.position.y = 0.55 + Math.sin(elapsed * 1.18) * 0.26;
      hoverRig.rotation.y = Math.sin(elapsed * 0.72) * 0.24 + currentPointerX * 0.18;
      hoverRig.rotation.z = Math.sin(elapsed * 0.9) * 0.018 - currentPointerX * 0.025;
      ufoGroup.rotation.x = 0.16 - currentPointerY * 0.07;
      ufoGroup.position.x = currentPointerX * 0.22;

      topHalo.material.opacity = 0.82 + Math.sin(elapsed * 2.1) * 0.1;
      undersideGlowRing.material.opacity = 0.56 + Math.sin(elapsed * 2.7) * 0.08;
      beamRing.material.opacity = 0.88 + Math.sin(elapsed * 3.4) * 0.08;
      innerBeamRing.material.opacity = 0.78 + Math.sin(elapsed * 4.1) * 0.1;
      innerBeamRing.rotation.z = elapsed * 0.8;
      beam.material.opacity = 0.34 + Math.sin(elapsed * 3.3) * 0.05;
      beamMid.material.opacity = 0.18 + Math.sin(elapsed * 2.6) * 0.04;
      beamOuter.material.opacity = 0.09 + Math.sin(elapsed * 2.1) * 0.03;
      topLight.intensity = 2 + Math.sin(elapsed * 2.1) * 0.16;
      undersideLight.intensity = 1.75 + Math.sin(elapsed * 2.7) * 0.2;
      beamLight.intensity = 2.7 + Math.sin(elapsed * 3.1) * 0.28;
      groundGlow.material.opacity = 0.14 + Math.sin(elapsed * 2.5) * 0.05;
      groundRing.material.opacity = 0.08 + Math.sin(elapsed * 2.1) * 0.03;

      undersideLightMaterials.forEach(({ material, phase }) => {
        material.emissiveIntensity = 1.35 + Math.sin(elapsed * 4.6 + phase) * 0.48;
      });

      edgeLightMaterials.forEach(({ material, phase }) => {
        material.emissiveIntensity = 0.9 + Math.sin(elapsed * 3.8 + phase) * 0.26;
      });

      const particlePositions = beamParticleGeometry.attributes.position.array;
      for (let index = 0; index < beamParticleCount; index += 1) {
        const seed = beamParticleSeeds[index];
        const progress = (elapsed * seed.speed + seed.offset) % 1;
        particlePositions[index * 3] = Math.cos(seed.angle + elapsed * 0.18) * seed.radius;
        particlePositions[index * 3 + 1] = -1.65 - progress * 6.7;
        particlePositions[index * 3 + 2] = Math.sin(seed.angle + elapsed * 0.18) * seed.radius;
      }
      beamParticleGeometry.attributes.position.needsUpdate = true;
      beamParticles.rotation.y = elapsed * 0.18;

      renderer.render(scene, camera);

      if (!reduceMotion) {
        window.requestAnimationFrame(renderUfoScene);
      }
    };

    renderUfoScene();
  } catch (_error) {
    // Fall back to the local image if Three.js or WebGL is unavailable.
  }
}

const openModal = (modal, trigger) => {
  if (!modal) {
    return;
  }

  if (activeModal) {
    closeModal(activeModal, false);
  }

  activeModal = modal;
  lastFocusedTrigger = trigger ?? null;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  window.requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });

  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
};

const closeModal = (modal, restoreFocus = true) => {
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  window.setTimeout(() => {
    modal.hidden = true;
  }, 220);

  if (restoreFocus && lastFocusedTrigger) {
    lastFocusedTrigger.focus();
  }

  activeModal = null;
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modalId = trigger.dataset.modalTarget;
    const modal = modalId ? document.getElementById(modalId) : null;
    openModal(modal, trigger);
  });
});

projectModals.forEach((modal) => {
  const closeTargets = modal.querySelectorAll("[data-close-modal]");

  closeTargets.forEach((target) => {
    target.addEventListener("click", () => {
      closeModal(modal);
    });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isIntroVisible()) {
      if (introVideo) {
        introVideo.pause();
      }

      dismissIntro();
      return;
    }

    if (activeModal) {
      closeModal(activeModal);
      return;
    }

    if (siteNav && siteNav.classList.contains("is-open")) {
      closeMobileMenu();
    }
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(".form-submit");
    const statusMessage = contactForm.querySelector(".form-status");
    if (!submitButton) {
      return;
    }

    const formUrlField = contactForm.querySelector('input[name="_url"]');
    if (formUrlField) {
      formUrlField.value = window.location.href;
    }

    const formAction = contactForm.getAttribute("action");
    const ajaxEndpoint = formAction
      ? formAction.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/")
      : "";

    if (!ajaxEndpoint) {
      if (statusMessage) {
        statusMessage.textContent = "The form endpoint is missing.";
        statusMessage.classList.add("is-error");
      }
      return;
    }

    const originalLabel = submitButton.textContent;
    const formData = new FormData(contactForm);

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;
    if (statusMessage) {
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-error");
    }

    try {
      const response = await fetch(ajaxEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("The message could not be sent.");
      }

      submitButton.textContent = "Message Sent";
      if (statusMessage) {
        statusMessage.textContent = "Your message has been sent successfully.";
      }
      contactForm.reset();
    } catch (_error) {
      submitButton.textContent = originalLabel;
      if (statusMessage) {
        statusMessage.textContent = "Message failed to send. Please try again in a moment.";
        statusMessage.classList.add("is-error");
      }
    } finally {
      window.setTimeout(() => {
        submitButton.textContent = originalLabel;
        submitButton.disabled = false;
      }, 1800);
    }
  });
}
