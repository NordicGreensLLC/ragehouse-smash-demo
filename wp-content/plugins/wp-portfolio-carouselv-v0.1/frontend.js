jQuery(document).ready(function($) {
    $('.portfolio-carousel-one').owlCarousel({
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        responsiveClass: true,
        smartSpeed: 900,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left left-icon"></i>',
            '<i class="bi bi-chevron-right right-icon"></i>'
        ],
        margin: 30,
        responsive: {
            0: { items: 1 },
            576: { items: 2 },
            768: { items: 2 },
            991: { items: 3 },
            1400: { items: 4 }
        }
    });
});