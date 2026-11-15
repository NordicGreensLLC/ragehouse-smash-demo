document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".testimonial-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoHeight: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                // Numbered pagination (1, 2, 3...)
                return '<span class="' + className + '">' + (index + 1) + "</span>";
            }
        }
    });
});
