// Google Reviews Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.google-review-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// Function to show specific slide
function currentSlide(n) {
  showSlide(currentSlideIndex = n - 1);
  resetAutoSlide();
}

// Function to show slide
function showSlide(n) {
  if (n >= slides.length) { currentSlideIndex = 0; }
  if (n < 0) { currentSlideIndex = slides.length - 1; }
  
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Remove active class from all dots
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  // Show current slide and activate corresponding dot
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add('active');
  }
  if (dots[currentSlideIndex]) {
    dots[currentSlideIndex].classList.add('active');
  }
}

// Function to go to next slide
function nextSlide() {
  currentSlideIndex++;
  showSlide(currentSlideIndex);
}

// Auto-slide functionality
function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

// Reset auto-slide when user interacts
function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }
  
  // Add hover pause functionality
  const sliderContainer = document.querySelector('.google-reviews-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
});