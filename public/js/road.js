

const initOriginMilestoneTimeline = () => {
  const milestoneItems = document.querySelectorAll('.origin-milestone-item');
  const progressFill = document.querySelector('.origin-milestone-progress-fill');
  const timeline = document.querySelector('.origin-milestone-timeline');

  if (!milestoneItems.length) return;

  // 1. Intersection Observer for item scroll-reveal & activation
  const observerOptions = {
    root: null, // browser viewport
    rootMargin: '0px 0px -15% 0px', // trigger 15% before bottom viewport
    threshold: 0.1 // 10% element intersection needed
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('origin-milestone-active');
      }
    });
  }, observerOptions);

  milestoneItems.forEach((item) => {
    observer.observe(item);
  });

  // 2. Continuous Scroll Progress Line Fill calculation
  const handleScrollProgress = () => {
    if (!timeline || !progressFill) return;

    const timelineRect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Start fill trigger point (e.g. bottom 80% of viewport)
    const triggerStart = viewportHeight * 0.8;
    const currentPosition = triggerStart - timelineRect.top;
    const totalHeight = timelineRect.height;

    let percentage = (currentPosition / totalHeight) * 100;
    
    // Smoothly clamp between 0% and 100%
    percentage = Math.min(Math.max(percentage, 0), 100);

    progressFill.style.height = `${percentage}%`;
  };

  // Passive listener for high-performance scroll handling
  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  // Initial check
  handleScrollProgress();
};

// Safely execute whether loaded async, deferred, or synchronously
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOriginMilestoneTimeline);
} else {
  initOriginMilestoneTimeline();
}