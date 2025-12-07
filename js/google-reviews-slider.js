// Google Reviews Slider mit Horizontal Scroll Funktionalität
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

// Function to reset auto slide
function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Function to start auto slide
function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Touch handling for mobile devices - DEAKTIVIERT
// function handleTouchStart(e) {
//   touchStartX = e.touches[0].clientX;
// }

// function handleTouchMove(e) {
//   touchEndX = e.touches[0].clientX;
// }

// function handleTouchEnd() {
//   if (!touchStartX || !touchEndX) return;
//   
//   const diffX = touchStartX - touchEndX;
//   const minSwipeDistance = 50;
//   
//   if (Math.abs(diffX) > minSwipeDistance) {
//     if (diffX > 0) {
//       // Swipe left - next slide
//       nextSlide();
//     } else {
//       // Swipe right - previous slide  
//       previousSlide();
//     }
//   }
//   
//   touchStartX = 0;
//   touchEndX = 0;
// }

// Mouse drag functionality - DEAKTIVIERT
// let isDragging = false;
// let dragStartX = 0;
// let dragEndX = 0;

// function handleMouseDown(e) {
//   isDragging = true;
//   dragStartX = e.clientX;
//   e.preventDefault();
// }

// function handleMouseMove(e) {
//   if (!isDragging) return;
//   dragEndX = e.clientX;
//   e.preventDefault();
// }

// function handleMouseUp() {
//   if (!isDragging) return;
//   
//   const diffX = dragStartX - dragEndX;
//   const minDragDistance = 50;
//   
//   if (Math.abs(diffX) > minDragDistance) {
//     if (diffX > 0) {
//       // Drag left - next slide
//       nextSlide();
//     } else {
//       // Drag right - previous slide
//       previousSlide();
//     }
//   }
//   
//   isDragging = false;
//   dragStartX = 0;
//   dragEndX = 0;
// }

// Mouse wheel horizontal scrolling - DEAKTIVIERT
// function handleWheel(e) {
//   if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//     // Vertical scroll detected - trigger slide change
//     e.preventDefault();
//     
//     if (e.deltaY > 0) {
//       // Scroll down - next slide
//       nextSlide();
//     } else {
//       // Scroll up - previous slide
//       previousSlide();
//     }
//   }
// }

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  slides = document.querySelectorAll('.google-review-slide');
  dots = document.querySelectorAll('.dot');
  
  if (slides.length === 0) return;
  
  // Show first slide
  showSlide(currentSlideIndex);
  
  // Start auto slide
  startAutoSlide();
  
  // Add event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => currentSlide(index + 1));
  });
  
  // Touch und Mouse Events - DEAKTIVIERT für nur Klick-Navigation
  // const sliderContainer = document.querySelector('.google-reviews-slider-container');
  // if (sliderContainer) {
  //   sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
  //   sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
  //   sliderContainer.addEventListener('touchend', handleTouchEnd);
  //   
  //   // Add mouse drag listeners
  //   sliderContainer.addEventListener('mousedown', handleMouseDown);
  //   sliderContainer.addEventListener('mousemove', handleMouseMove);
  //   sliderContainer.addEventListener('mouseup', handleMouseUp);
  //   sliderContainer.addEventListener('mouseleave', handleMouseUp);
  //   
  //   // Add wheel event for horizontal scrolling - DEAKTIVIERT
  //   // sliderContainer.addEventListener('wheel', handleWheel, { passive: false });
  // }
  
  // Pause auto slide when user hovers over the slider
  const slider = document.querySelector('.google-reviews-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
});