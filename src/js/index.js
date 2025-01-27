// Function to toggle translation with fade effect and resume change
function toggleTranslation() {
	const elements = document.querySelectorAll('[data-translate]');
	const resumeLink = document.getElementById('resume-download');
	
	elements.forEach(element => {
		if (!element.hasAttribute('data-original-text')) {
			element.setAttribute('data-original-text', element.textContent);
		}

		const originalText = element.getAttribute('data-original-text');
		const translatedText = element.getAttribute('data-translate');

		element.classList.add('fade-out');
		
		setTimeout(() => {
			if (element.textContent === translatedText) {
				element.textContent = originalText; 
			} else {
				element.textContent = translatedText;
			}
			
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		}, 300);
		
		setTimeout(() => {
			element.classList.remove('fade-in');
		}, 600);
	});

	if (resumeLink) {
		const currentHref = resumeLink.getAttribute('href');
		if (currentHref.includes('resume-en')) {
			resumeLink.setAttribute('href', '../portfolio/src/files/resume-pt.pdf');
			resumeLink.setAttribute('download', 'Yanni Nadur - Resume PT');
		} else {
			resumeLink.setAttribute('href', '../portfolio/src/files/resume-en.pdf');
			resumeLink.setAttribute('download', 'Yanni Nadur - Resume EN');
		}
	}
}

// Language Toggle
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
		e.preventDefault();

		const target = document.querySelector(anchor.getAttribute('href'));
		if (!target) return;

		const offset = 100;
		const startPosition = window.pageYOffset;
		const targetPosition = target.getBoundingClientRect().top - offset; 
		const duration = 1000; 
		const startTime = performance.now();

		const easeInOutQuad = (t, b, c, d) => {
			t /= d / 2;
			return t < 1 ? (c / 2) * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
		};

		const smoothScroll = currentTime => {
			const elapsed = currentTime - startTime;
			const scrollAmount = easeInOutQuad(elapsed, startPosition, targetPosition, duration);

			window.scrollTo(0, scrollAmount);
			if (elapsed < duration) requestAnimationFrame(smoothScroll);
			else window.scrollTo(0, startPosition + targetPosition);
		};

		requestAnimationFrame(smoothScroll); 
	});
});

// Header Scroll Behavior
const header = document.querySelector('header');
const backToTopButton = document.getElementById('back-to-top');

const toggleHeaderScrolled = () => {
	const scrolled = window.scrollY > 0;

	header.classList.toggle('scrolled', scrolled);

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
