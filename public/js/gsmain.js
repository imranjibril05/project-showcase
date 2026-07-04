// Pure JavaScript storytelling engine for Origin Landing section (No Framework, Scoped for Existing Site copy-pasting)

function interpolate(value, inputRange, outputRange) {
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  for (let i = 0; i < inputRange.length - 1; i++) {
    const minInput = inputRange[i];
    const maxInput = inputRange[i + 1];
    if (value >= minInput && value <= maxInput) {
      const progress = (value - minInput) / (maxInput - minInput);
      const minOutput = outputRange[i];
      const maxOutput = outputRange[i + 1];
      return minOutput + progress * (maxOutput - minOutput);
    }
  }
  return outputRange[0];
}

function interpolateColor(value, inputRange, outputRange) {
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  for (let i = 0; i < inputRange.length - 1; i++) {
    const minInput = inputRange[i];
    const maxInput = inputRange[i + 1];
    if (value >= minInput && value <= maxInput) {
      const progress = (value - minInput) / (maxInput - minInput);
      const colorStart = outputRange[i];
      const colorEnd = outputRange[i + 1];
      
      const r1 = parseInt(colorStart.slice(1, 3), 16);
      const g1 = parseInt(colorStart.slice(3, 5), 16);
      const b1 = parseInt(colorStart.slice(5, 7), 16);
      
      const r2 = parseInt(colorEnd.slice(1, 3), 16);
      const g2 = parseInt(colorEnd.slice(3, 5), 16);
      const b2 = parseInt(colorEnd.slice(5, 7), 16);
      
      const r = Math.round(r1 + progress * (r2 - r1));
      const g = Math.round(g1 + progress * (g2 - g1));
      const b = Math.round(b1 + progress * (b2 - b1));
      
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return outputRange[0];
}

function initStorytelling() {
  // Grab namespaced DOM references
  const scrollContainer = document.getElementById("origin-build-scroll-container");
  const viewportCanvas = document.getElementById("origin-build-viewport-canvas");
  const mouseGlow = document.getElementById("origin-build-mouse-glow");

  // Panel 1
  const panelOne = document.getElementById("origin-build-panel-one");
  const p1Build = document.getElementById("origin-build-p1-build");
  const p1The = document.getElementById("origin-build-p1-the");
  const p1Impossible = document.getElementById("origin-build-p1-impossible");
  const p1Subtext = document.getElementById("origin-build-p1-subtext");

  // Panel 2
  const panelTwo = document.getElementById("origin-build-panel-two");
  const p2S1 = document.getElementById("origin-build-p2-s1");
  const p2S2 = document.getElementById("origin-build-p2-s2");
  const p2S3 = document.getElementById("origin-build-p2-s3");
  const p2S4 = document.getElementById("origin-build-p2-s4");
  const p2S5 = document.getElementById("origin-build-p2-s5");

  // Panel 3
  const panelThree = document.getElementById("origin-build-panel-three");
  const p3Text1 = document.getElementById("origin-build-p3-text1");
  const p3Text2 = document.getElementById("origin-build-p3-text2");
  const p3Logo = document.getElementById("origin-build-p3-logo");

  // Auxiliary UI
  const topProgressBar = document.getElementById("origin-build-top-progress-bar");
  const scrollPrompt = document.getElementById("origin-build-scroll-down-prompt");
  const footerBeginScrolling = document.getElementById("origin-build-footer-begin-scrolling");

  const phase01Indicator = document.getElementById("origin-build-phase-01-indicator");
  const phase02Indicator = document.getElementById("origin-build-phase-02-indicator");
  const phase03Indicator = document.getElementById("origin-build-phase-03-indicator");

  const dotBtn0 = document.getElementById("origin-build-dot-btn-0");
  const dotBtn1 = document.getElementById("origin-build-dot-btn-1");
  const dotBtn2 = document.getElementById("origin-build-dot-btn-2");

  // Smooth Interpolation State (Inertia)
  let targetProgress = 0;
  let currentProgress = 0;

  // Track scroll position of the section itself to support copy-pasting middle-of-page
  const updateScrollProgress = () => {
    if (!scrollContainer) return;
    
    const rect = scrollContainer.getBoundingClientRect();
    const sectionHeight = scrollContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Scrolled relative to section offset
    const totalScrollableDistance = sectionHeight - viewportHeight;
    const scrolledDistance = -rect.top;
    
    let progress = scrolledDistance / totalScrollableDistance;
    progress = Math.max(0, Math.min(1, progress));
    
    targetProgress = progress;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  // Desktop Mouse glow handler
  window.addEventListener("mousemove", (e) => {
    if (mouseGlow) {
      const x = e.clientX;
      const y = e.clientY;
      mouseGlow.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
    }
  });

  // Navigation Click Handlers (Relative scroll matching)
  const handleDotNavigation = (index) => {
    if (!scrollContainer) return;
    
    // Find absolute position of the section top plus the ratio of section scrollable height
    const sectionTop = window.scrollY + scrollContainer.getBoundingClientRect().top;
    const sectionHeight = scrollContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    const maxScrollInSection = sectionHeight - viewportHeight;

    let targetScroll = sectionTop;
    if (index === 1) {
      targetScroll = sectionTop + maxScrollInSection * 0.42;
    } else if (index === 2) {
      targetScroll = sectionTop + maxScrollInSection * 0.88;
    }

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  if (dotBtn0) dotBtn0.addEventListener("click", () => handleDotNavigation(0));
  if (dotBtn1) dotBtn1.addEventListener("click", () => handleDotNavigation(1));
  if (dotBtn2) dotBtn2.addEventListener("click", () => handleDotNavigation(2));

  // Visual updater logic inside requestAnimationFrame loop (smooth-dampen effect)
  const tick = () => {
    // Smooth lerp: current moves towards target
    currentProgress += (targetProgress - currentProgress) * 0.08;

    // Avoid micro variations
    if (Math.abs(targetProgress - currentProgress) < 0.0001) {
      currentProgress = targetProgress;
    }

    // 1. Viewport background transitions
    if (viewportCanvas) {
      const bg = interpolateColor(
        currentProgress,
        [0.0, 0.22, 0.28, 0.62, 0.67, 1.0],
        ["#000000", "#000000", "#101010", "#101010", "#000000", "#000000"]
      );
      viewportCanvas.style.backgroundColor = bg;
    }

    // 2. Panel 1 Elements Animation
    if (panelOne) {
      if (currentProgress < 0.28) {
        panelOne.style.visibility = "visible";
        panelOne.style.opacity = interpolate(currentProgress, [0.0, 0.21, 0.26], [1, 1, 0]).toString();

        if (p1Build) {
          p1Build.style.opacity = interpolate(currentProgress, [0.0, 0.04, 0.21, 0.26], [0, 1, 1, 0]).toString();
          p1Build.style.transform = `translateY(${interpolate(currentProgress, [0.0, 0.04, 0.21, 0.26], [50, 0, 0, -50])}px)`;
        }
        if (p1The) {
          p1The.style.opacity = interpolate(currentProgress, [0.02, 0.07, 0.21, 0.26], [0, 1, 1, 0]).toString();
          p1The.style.transform = `translateY(${interpolate(currentProgress, [0.02, 0.07, 0.21, 0.26], [50, 0, 0, -50])}px)`;
        }
        if (p1Impossible) {
          p1Impossible.style.opacity = interpolate(currentProgress, [0.05, 0.1, 0.21, 0.26], [0, 1, 1, 0]).toString();
          p1Impossible.style.transform = `translateY(${interpolate(currentProgress, [0.05, 0.1, 0.21, 0.26], [50, 0, 0, -50])}px)`;
        }
        if (p1Subtext) {
          p1Subtext.style.opacity = interpolate(currentProgress, [0.09, 0.14, 0.21, 0.26], [0, 1, 1, 0]).toString();
          p1Subtext.style.transform = `translateY(${interpolate(currentProgress, [0.09, 0.14, 0.21, 0.26], [40, 0, 0, -40])}px)`;
        }
      } else {
        panelOne.style.visibility = "hidden";
        panelOne.style.opacity = "0";
      }
    }

    // 3. Panel 2 Elements Animation
    if (panelTwo) {
      if (currentProgress >= 0.22 && currentProgress < 0.68) {
        panelTwo.style.visibility = "visible";
        panelTwo.style.opacity = "1";

        if (p2S1) {
          p2S1.style.opacity = interpolate(currentProgress, [0.24, 0.28, 0.36, 0.40, 0.61, 0.66], [0, 1, 1, 0.25, 0.25, 0]).toString();
          p2S1.style.transform = `translateY(${interpolate(currentProgress, [0.24, 0.28, 0.36, 0.40, 0.61, 0.66], [40, 0, 0, -5, -5, -40])}px)`;
        }
        if (p2S2) {
          p2S2.style.opacity = interpolate(currentProgress, [0.32, 0.36, 0.43, 0.47, 0.61, 0.66], [0, 1, 1, 0.25, 0.25, 0]).toString();
          p2S2.style.transform = `translateY(${interpolate(currentProgress, [0.32, 0.36, 0.43, 0.47, 0.61, 0.66], [40, 0, 0, -5, -5, -40])}px)`;
        }
        if (p2S3) {
          p2S3.style.opacity = interpolate(currentProgress, [0.39, 0.43, 0.50, 0.54, 0.61, 0.66], [0, 1, 1, 0.25, 0.25, 0]).toString();
          p2S3.style.transform = `translateY(${interpolate(currentProgress, [0.39, 0.43, 0.50, 0.54, 0.61, 0.66], [40, 0, 0, -5, -5, -40])}px)`;
        }
        if (p2S4) {
          p2S4.style.opacity = interpolate(currentProgress, [0.46, 0.50, 0.56, 0.60, 0.61, 0.66], [0, 1, 1, 0.25, 0.25, 0]).toString();
          p2S4.style.transform = `translateY(${interpolate(currentProgress, [0.46, 0.50, 0.56, 0.60, 0.61, 0.66], [40, 0, 0, -5, -5, -40])}px)`;
        }
        if (p2S5) {
          p2S5.style.opacity = interpolate(currentProgress, [0.52, 0.56, 0.62, 0.66], [0, 1, 1, 0]).toString();
          p2S5.style.transform = `translateY(${interpolate(currentProgress, [0.52, 0.56, 0.62, 0.66], [40, 0, 0, -40])}px)`;
        }
      } else {
        panelTwo.style.visibility = "hidden";
        panelTwo.style.opacity = "0";
      }
    }

    // 4. Panel 3 Elements Animation
    if (panelThree) {
      if (currentProgress >= 0.62) {
        panelThree.style.visibility = "visible";
        panelThree.style.opacity = "1";

        if (p3Text1) {
          p3Text1.style.opacity = interpolate(currentProgress, [0.65, 0.71, 1.0], [0, 1, 1]).toString();
          p3Text1.style.transform = `translateY(${interpolate(currentProgress, [0.65, 0.71, 1.0], [50, 0, 0])}px)`;
        }
        if (p3Text2) {
          p3Text2.style.opacity = interpolate(currentProgress, [0.74, 0.80, 1.0], [0, 1, 1]).toString();
          p3Text2.style.transform = `translateY(${interpolate(currentProgress, [0.74, 0.80, 1.0], [40, 0, 0])}px)`;
        }
        if (p3Logo) {
          p3Logo.style.opacity = interpolate(currentProgress, [0.83, 0.90, 1.0], [0, 1, 1]).toString();
          p3Logo.style.transform = `translateY(${interpolate(currentProgress, [0.83, 0.90, 1.0], [30, 0, 0])}px)`;
        }
      } else {
        panelThree.style.visibility = "hidden";
        panelThree.style.opacity = "0";
      }
    }

    // 5. Progress Bar
    if (topProgressBar) {
      topProgressBar.style.width = `${currentProgress * 100}%`;
    }

    // 6. Scroll Prompts & Footers
    if (scrollPrompt) {
      scrollPrompt.style.opacity = interpolate(currentProgress, [0.0, 0.08], [1, 0]).toString();
      scrollPrompt.style.transform = `translateX(-50%) translateY(${interpolate(currentProgress, [0.0, 0.08], [0, 15])}px)`;
    }

    if (footerBeginScrolling) {
      footerBeginScrolling.style.opacity = interpolate(currentProgress, [0.0, 0.12], [1, 0]).toString();
    }

    // Active Phases indicator opacity toggling
    if (currentProgress < 0.26) {
      phase01Indicator?.classList.add("origin-build-active");
      phase02Indicator?.classList.remove("origin-build-active");
      phase03Indicator?.classList.remove("origin-build-active");
    } else if (currentProgress >= 0.26 && currentProgress < 0.65) {
      phase01Indicator?.classList.remove("origin-build-active");
      phase02Indicator?.classList.add("origin-build-active");
      phase03Indicator?.classList.remove("origin-build-active");
    } else {
      phase01Indicator?.classList.remove("origin-build-active");
      phase02Indicator?.classList.remove("origin-build-active");
      phase03Indicator?.classList.add("origin-build-active");
    }

    // 7. Right Dot Nav Active styling
    let activeIndex = 0;
    if (currentProgress < 0.26) {
      activeIndex = 0;
    } else if (currentProgress >= 0.26 && currentProgress < 0.65) {
      activeIndex = 1;
    } else {
      activeIndex = 2;
    }

    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById(`origin-build-dot-btn-${i}`);
      if (!btn) continue;
      if (i === activeIndex) {
        btn.classList.add("origin-build-active");
      } else {
        btn.classList.remove("origin-build-active");
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStorytelling);
} else {
  initStorytelling();
}