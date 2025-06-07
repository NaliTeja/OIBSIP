// Typing effect for quote
const quote = "My grandfather once told me that there are two kinds of people: those who do the work and those who take the credit. Try to be in the first group; there is less competition there.";
const quoteEl = document.getElementById('quote');
let index = 0;

function typeQuote() {
  if (index < quote.length) {
    quoteEl.textContent += quote.charAt(index);
    index++;
    setTimeout(typeQuote, 30);
  }
}

// Scroll to top button
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 150) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }

  // Animate elements on scroll
  animateOnScroll();
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Animate elements with slide effects when they come into viewport
function animateOnScroll() {
  const lefts = document.querySelectorAll('.slide-in-left');
  const rights = document.querySelectorAll('.slide-in-right');
  const ups = document.querySelectorAll('.slide-in-up');

  lefts.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('animate-slide-in-left');
    }
  });

  rights.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('animate-slide-in-right');
    }
  });

  ups.forEach(el => {
    if (isElementInViewport(el)) {
      el.classList.add('animate-slide-in-up');
    }
  });
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 100
  );
}

// Initial typing effect + trigger animations for visible elements on page load
window.addEventListener('load', () => {
  typeQuote();
  animateOnScroll();
});
