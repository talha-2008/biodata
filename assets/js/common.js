// Shared reveal script (IntersectionObserver)
document.addEventListener('DOMContentLoaded', function(){
  const selectors = '.bio-card, .social-links, .project-card, .trip, .post, .timeline-item';
  const faders = document.querySelectorAll(selectors);

  const appearOptions = {
    threshold:0.18,
    rootMargin:'0px 0px -40px 0px'
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(f => appearOnScroll.observe(f));
});
