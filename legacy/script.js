// Expandable Project Cards
document.querySelectorAll('.read-more').forEach(button => {
  button.addEventListener('click', () => {
    const moreInfo = button.nextElementSibling;
    if (moreInfo && moreInfo.classList.contains('more-info')) {
      moreInfo.style.display = moreInfo.style.display === 'block' ? 'none' : 'block';
      button.textContent = moreInfo.style.display === 'block' ? 'Read Less' : 'Read More';
    }
  });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default jump behavior
    const targetId = this.getAttribute('href'); // Get the target section ID
    const targetSection = document.querySelector(targetId); // Find the target section
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth', // Smooth scroll
        block: 'start' // Align to the top of the section
      });
    } else {
      console.warn(`Target section not found: ${targetId}`);
    }
  });
});

// Typing Animation Script
const typingText = document.querySelector('.typing-animation');
if (typingText) {
  const text = typingText.textContent;
  typingText.textContent = ''; // Clear the text initially

  let index = 0;
  let animationStarted = false; // Track if the animation has started

  function type() {
    if (index < text.length) {
      typingText.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100); // Adjust typing speed (100ms per character)
    }
  }

  // Intersection Observer to trigger typing animation
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStarted) {
            type(); // Start the typing animation
            animationStarted = true; // Mark animation as started
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    observer.observe(aboutSection); // Observe the About section
  }
}
// Navbar Scroll Effect
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Hero Section Animation
const heroSection = document.querySelector('#hero');

if (heroSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a class to trigger the animations
          heroSection.classList.add('animate-hero');
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the section is visible
  );

  observer.observe(heroSection); // Observe the hero section
}
