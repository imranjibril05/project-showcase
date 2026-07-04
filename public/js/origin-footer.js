/* ==========================================================================
     ORIGIN PREMIUM FOOTER - INTERACTION & VIEWPORT SCROLL ANIMATIONS
     ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // IntersectionObserver is used to trigger clean fade-up animations on scroll entry
  const initScrollAnimations = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger animations slightly before element is fully visible
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('origin-footer-visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.origin-footer-animate-in');
    animatedElements.forEach(el => observer.observe(el));
  };

  // Safe fallback if IntersectionObserver is unsupported in legacy web browsers
  if ('IntersectionObserver' in window) {
    initScrollAnimations();
  } else {
    const animatedElements = document.querySelectorAll('.origin-footer-animate-in');
    animatedElements.forEach(el => el.classList.add('origin-footer-visible'));
  }
});