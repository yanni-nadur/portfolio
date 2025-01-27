// Function to toggle translation with fade effect
function toggleTranslation() {
	const elements = document.querySelectorAll('[data-translate]'); // Select all elements with data-translate attribute
	
	elements.forEach(element => {
	  // Check if the original text has already been stored
	  if (!element.hasAttribute('data-original-text')) {
		element.setAttribute('data-original-text', element.textContent); // Store the original text if not already stored
	  }
  
	  // Get the current text content and the translated text
	  const originalText = element.getAttribute('data-original-text');
	  const translatedText = element.getAttribute('data-translate');
  
	  // Fade out effect
	  element.classList.add('fade-out');
	  
	  // After fade-out finishes, change text and fade in
	  setTimeout(() => {
		// Toggle between original text and translated text
		if (element.textContent === translatedText) {
		  element.textContent = originalText; // Switch back to the original text
		} else {
		  element.textContent = translatedText; // Switch to the translated text
		}
		
		// Fade in effect
		element.classList.remove('fade-out');
		element.classList.add('fade-in');
	  }, 300); // Match the duration of the fade-out transition (300ms)
	  
	  // Reset fade-in after it's done
	  setTimeout(() => {
		element.classList.remove('fade-in');
	  }, 600); // Match the duration of the fade-in transition (600ms)
	});
}
  
// // Event listener for the button to toggle translation
// document.getElementById('translateButton').addEventListener('click', toggleTranslation);
  

const toggleButtons = document.querySelectorAll('.language-toggle-button');

toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
	toggleTranslation();
  });
});

// Initialize Swipers
const createSwiper = (container, nextButton, prevButton, pagination) => {
	new Swiper(container, {
		loop: true,
		effect: 'fade',
		fadeEffect: { crossFade: true },
		speed: 1000,
		autoplay: {
			delay: 3000,
			disableOnInteraction: container.includes('testimonials'),
		},
		slidesPerView: 1,
		spaceBetween: 0,
		grabCursor: true,
		navigation: { nextEl: nextButton, prevEl: prevButton },
		pagination: { el: pagination, clickable: true },
	});
};

createSwiper('.testimonials-swiper-container', '.testimonials-swiper-button-next', '.testimonials-swiper-button-prev', '.testimonials-swiper-pagination');
createSwiper('.projects-swiper-container', '.projects-swiper-button-next', '.projects-swiper-button-prev', '.projects-swiper-pagination');

// Smooth Scroll for Anchor Links with Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', e => {
		e.preventDefault(); // Impede o comportamento padrão do clique

		const target = document.querySelector(anchor.getAttribute('href')); // Obtem o elemento alvo
		if (!target) return;

		const offset = 100; // Offset para parar antes da âncora
		const startPosition = window.pageYOffset; // Posição inicial de rolagem
		const targetPosition = target.getBoundingClientRect().top - offset; // Posição da âncora ajustada com o offset
		const duration = 1000; // Duração da animação em ms
		const startTime = performance.now(); // Hora de início

		// Função de easing (easeInOutQuad)
		const easeInOutQuad = (t, b, c, d) => {
			t /= d / 2;
			return t < 1 ? (c / 2) * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
		};

		// Função de animação
		const smoothScroll = currentTime => {
			const elapsed = currentTime - startTime; // Tempo decorrido
			const scrollAmount = easeInOutQuad(elapsed, startPosition, targetPosition, duration); // Calcula o deslocamento suave

			window.scrollTo(0, scrollAmount); // Rola para a posição calculada
			if (elapsed < duration) requestAnimationFrame(smoothScroll); // Continua a animação até terminar
			else window.scrollTo(0, startPosition + targetPosition); // Garante que chegue exatamente ao destino
		};

		requestAnimationFrame(smoothScroll); // Inicia a animação
	});
});

// Header Scroll Behavior
const header = document.querySelector('header');
const backToTopButton = document.getElementById('back-to-top');

const toggleHeaderScrolled = () => {
	const scrolled = window.scrollY > 0;

	// Toggle "scrolled" class on the header
	header.classList.toggle('scrolled', scrolled);

	// Add or remove "top-hidden" class on the back-to-top button
	if (backToTopButton) {
		backToTopButton.classList.toggle('top-hidden', !scrolled);
	}
};

// Add scroll event listener and initialize on load
document.addEventListener('scroll', toggleHeaderScrolled);
toggleHeaderScrolled(); // Initialize on load


// Hamburger Menu Toggle
const toggleMobileMenu = () => {
	const body = document.body;
	const header = document.querySelector('header');
	const hamburger = document.querySelector('.hamburger');

	hamburger.addEventListener('click', () => {
		hamburger.classList.toggle('is-active');
		header.classList.toggle('mobile-open');
		body.classList.toggle('no-scroll');
	});

	document.querySelectorAll('.mobile-menu-item').forEach(item => {
		item.addEventListener('click', () => {
			hamburger.classList.remove('is-active');
			header.classList.remove('mobile-open');
			body.classList.remove('no-scroll');
		});
	});
};
toggleMobileMenu();

// Update Year
document.getElementById('currentYear').textContent = `© ${new Date().getFullYear()} - Yanni Nadur`;
