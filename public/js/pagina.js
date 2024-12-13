$(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
        $('.header-sticky').addClass('sticky');
    } else {
        $('.header-sticky').removeClass('sticky');
    }
});

var intro11Slider = new Swiper('.intro11-slider', {
    loop: true,
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 10,
    effect: 'fade',
    navigation: {
        nextEl: '.home1-slider-next',
        prevEl: '.home1-slider-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: 'true',
    },
});

var intro11Slider = new Swiper('.testimonial-carousel', {
    loop: true,
    speed: 800,
    slidesPerView: 1,
    spaceBetween: 10,
    effect: 'slide',
    navigation: {
        nextEl: '.home1-slider-next',
        prevEl: '.home1-slider-prev',
    },
});

function scrollToTop() {
    var $scrollUp = $('.scroll-to-top'),
        $lastScrollTop = 0,
        $window = $(window);

    $window.on('scroll', function () {
        var topPos = $(this).scrollTop();
        if (topPos > $lastScrollTop) {
            $scrollUp.removeClass('show');
        } else {
            if ($window.scrollTop() > 200) {
                $scrollUp.addClass('show');
            } else {
                $scrollUp.removeClass('show');
            }
        }
        $lastScrollTop = topPos;
    });

    $scrollUp.on('click', function (evt) {
        $('html, body').animate({
            scrollTop: 0
        }, 600);
        evt.preventDefault();
    });
}
scrollToTop();

$(window).on('load', function () {
    $('#preloader').delay(350).fadeOut('slow');
    $('body').delay(350).css({'overflow':'visible'});
});
