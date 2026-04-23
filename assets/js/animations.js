document.addEventListener('DOMContentLoaded', function () {

    // Scroll reveal: add .reveal to experience and news sections
    document.querySelectorAll('.row.mt-3, .my-3').forEach(function (el) {
        el.classList.add('reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });

    // Stagger reveal delay for multiple cards
    document.querySelectorAll('.reveal').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.1) + 's';
    });

});
