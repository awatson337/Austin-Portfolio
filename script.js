(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealEls = document.querySelectorAll('.reveal');
    const groupCounts = new Map();
    revealEls.forEach((el) => {
        const parent = el.parentElement;
        const index = groupCounts.get(parent) || 0;
        el.style.transitionDelay = prefersReduced ? '0ms' : `${index * 90}ms`;
        groupCounts.set(parent, index + 1);
    });

    if (prefersReduced || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => revealObserver.observe(el));
    }

    const skillsContainer = document.querySelector('.skills-container');
    const bars = skillsContainer ? skillsContainer.querySelectorAll('.bar') : [];

    if (bars.length && !prefersReduced && 'IntersectionObserver' in window) {
        bars.forEach((bar) => {
            bar.style.height = '0px';
        });

        void skillsContainer.offsetHeight;

        const barObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    bars.forEach((bar) => {
                        bar.style.height = '';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        barObserver.observe(skillsContainer);
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();
