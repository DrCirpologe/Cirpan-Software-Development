// Google Reviews Slider Functionality
let currentSlideIndex = 0;
let slides, dots, slideInterval;
let touchStartX = 0;
let touchEndX = 0;

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
  resetAutoSlide();
}

// Function to go to previous slide
function previousSlide() {
  currentSlideIndex--;
  showSlide(currentSlideIndex);
  resetAutoSlide();
}

// Auto-slide functionality
function startAutoSlide() {
  slideInterval = setInterval(() => {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
  }, 4000); // Change slide every 4 seconds
}

// Reset auto-slide when user interacts
function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Touch/Swipe functionality
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
  e.preventDefault(); // Prevent scrolling while swiping
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  const swipeDistance = touchStartX - touchEndX;
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      // Swiped left - go to next slide
      nextSlide();
    } else {
      // Swiped right - go to previous slide
      previousSlide();
    }
  }
}

// Mouse drag functionality
let isDragging = false;
let mouseStartX = 0;

function handleMouseDown(e) {
  isDragging = true;
  mouseStartX = e.clientX;
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isDragging) return;
  e.preventDefault();
}

function handleMouseUp(e) {
  if (!isDragging) return;
  
  const mouseEndX = e.clientX;
  const dragDistance = mouseStartX - mouseEndX;
  const dragThreshold = 50;
  
  if (Math.abs(dragDistance) > dragThreshold) {
    if (dragDistance > 0) {
      // Dragged left - go to next slide
      nextSlide();
    } else {
      // Dragged right - go to previous slide
      previousSlide();
    }
  }
  
  isDragging = false;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  slides = document.querySelectorAll('.google-review-slide');
  dots = document.querySelectorAll('.dot');
  
  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();
  }
  
  const sliderContainer = document.querySelector('.google-reviews-slider-container');
  if (sliderContainer) {
    // Hover pause functionality
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
    
    // Touch events for mobile swiping
    sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events for desktop dragging
    sliderContainer.addEventListener('mousedown', handleMouseDown);
    sliderContainer.addEventListener('mousemove', handleMouseMove);
    sliderContainer.addEventListener('mouseup', handleMouseUp);
    sliderContainer.addEventListener('mouseleave', handleMouseUp);
    
    // Prevent context menu on right click
    sliderContainer.addEventListener('contextmenu', e => e.preventDefault());
  }
});