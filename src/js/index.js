const testimonialsSwiper = new Swiper('.testimonials-swiper-container', {
	loop: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	speed: 1000,
	autoplay: {
		delay: 3000,
		disableOnInteraction: true,
	},
	slidesPerView: 1,
	spaceBetween: 0,
	grabCursor: true,
	navigation: {
		nextEl: '.testimonials-swiper-button-next',
		prevEl: '.testimonials-swiper-button-prev',
	},
	pagination: {
		el: '.testimonials-swiper-pagination',
		clickable: true,
	},
});

const projectsSwiper = new Swiper('.projects-swiper-container', {
	loop: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	speed: 1000,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	slidesPerView: 1,
	spaceBetween: 0,
	grabCursor: true,
	navigation: {
		nextEl: '.projects-swiper-button-next',
		prevEl: '.projects-swiper-button-prev',
	},
	pagination: {
		el: '.projects-swiper-pagination',
		clickable: true,
	},
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const startPosition = window.pageYOffset;
            const targetPosition = target.getBoundingClientRect().top;
            const duration = 1000;
            const startTime = performance.now();

            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            function smoothScroll(currentTime) {
                const timeElapsed = currentTime - startTime;
                const scrollAmount = easeInOutQuad(timeElapsed, startPosition, targetPosition, duration);

                window.scrollTo(0, scrollAmount);

                if (timeElapsed < duration) {
                    requestAnimationFrame(smoothScroll);
                } else {
                    window.scrollTo(0, startPosition + targetPosition);
                }
            }

            requestAnimationFrame(smoothScroll);
        }
    });
});

document.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


function updateYear() {
    const yearElement = document.getElementById('currentYear');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `© ${currentYear} - Yanni Nadur `;
}

updateYear();