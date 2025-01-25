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

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', e => {
		e.preventDefault();
		const target = document.querySelector(anchor.getAttribute('href'));
		if (!target) return;

		const startPosition = window.pageYOffset;
		const targetPosition = target.getBoundingClientRect().top;
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
const toggleHeaderScrolled = () => header.classList.toggle('scrolled', window.scrollY > 0);
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
