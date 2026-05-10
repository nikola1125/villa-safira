/* Scroll‑reveal helper for Villa Safira
   Adds the .visible class when an element enters the viewport.
   The CSS in style.css animates .reveal → .reveal.visible.
*/

document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.reveal');

  // Use IntersectionObserver for efficiency
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // stop observing once revealed
        }
      });
    },
    { threshold: 0.15 } // reveal when 15% of the element is visible
  );

  targets.forEach(el => observer.observe(el));
});
