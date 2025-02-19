function initClickList() {
  const clickableList = $('.clickable-list');

  clickableList.each(function () {
    const clickBlock = $(this);
    const clickItems = clickBlock.find('.clickable');

    clickItems.on('click', function () {
      const clickItem = $(this);
      if (!clickItem.hasClass('active')) {
        const otherActive = clickBlock.find('.active');
        otherActive.removeClass('active');
        clickItem.addClass('active');

        if (clickItem.hasClass('is-accordion')) {
          clickItem.animate({ height: clickItem.data().maxHeight }, 300);
        }
        if (otherActive.hasClass('is-accordion')) {
          otherActive.animate({ height: otherActive.data().minHeight }, 300);
        }
      }
    });
  });
}

function initClickSolo() {
  const clickableListSolo = $('.clickable-solo');

  clickableListSolo.each(function () {
    const clickElement = $(this);
    let activeTimer;

    clickElement.on('click', function (e) {
      e.stopPropagation();
      clickElement.toggleClass('active');

      if (clickElement.hasClass('burger-btn')) {
        $('html').toggleClass('menu-opened');
      }

      if (clickElement.hasClass('click-timer')) {
        if (clickElement.hasClass('active')) {
          activeTimer = setTimeout(() => {
            if (clickElement.hasClass('active')) {
              clickElement.removeClass('active');
            }
          }, 7000);
        } else {
          clearTimeout(activeTimer);
        }
      }
    });
  });

  $(document).on('click', function () {
    const activeSolo = $('.clickable-solo.independent.active');
    if (activeSolo.length) {
      activeSolo.removeClass('active');

      if ($('.clickable-solo.active.click-timer').length) {
        clearTimeout(activeTimer);
      }
    }
  });

  $('.closed-window').on('click', function () {
    $('.clickable-solo.active').removeClass('active');
    $('html').removeClass('menu-opened');
  });

  $(document).keyup(function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if ($('.clickable-solo.active').length) {
        $('.clickable-solo.active').removeClass('active');
      }
      if ($('html.menu-opened').length) {
        $('html').removeClass('menu-opened');
      }
      if (activeSolo.length) {
        activeSolo.removeClass('active');

        if ($('.clickable-solo.active.click-timer').length) {
          clearTimeout(activeTimer);
        }
      }
    }
  });
}

function initAccordions() {
  const accordionsList = $('.is-accordion');

  accordionsList.each(function () {
    const element = $(this);
    element.css('height', 'auto');
    if (element.hasClass('active')) {
      element.data('firstActive', true);
      element.removeClass('active');
    }
    element.data('minHeight', element.css('height'));
    element.addClass('active');
    element.data('maxHeight', element.css('height'));
    element.removeClass('active');

    if (element.data('firstActive')) {
      element.css('height', element.data('maxHeight'));
      element.addClass('active');
      element.data('firstActive', false);
    } else {
      element.css('height', element.data('minHeight'));
    }
    //console.log(element.data('firstActive') + ' element. max: ' + element.data('maxHeight') + '. min: ' + element.data('minHeight'));
  });
}

function initLandingNav() {
  const sections = $('section');
  const nav = $('nav');
  const nav_height = nav.outerHeight();

  $(window).on('scroll', function () {
    const cur_pos = $(this).scrollTop();
    sections.each(function () {
      const top = $(this).offset().top - nav_height - 180;
      const bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        nav.find('a').removeClass('active');
        sections.removeClass('active');
        $(this).addClass('active');
        nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
      }
    });
  });

  nav.find('a').on('click', function (e) {
    e.preventDefault();
    const id = $(this).attr('href');
    $('html, body').animate(
      { scrollTop: $(id).offset().top - nav_height },
      600
    );
    $('.clickable-solo.active').removeClass('active');
    $('html.menu-opened').removeClass('menu-opened');
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

$(function () {
  initClickList();
  initClickSolo();
  initAccordions();
  initLandingNav();

  $('.whyus-block .slider').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    arrows: false,
    mobileFirst: true,
    slide: '.slide',
    responsive: [
      {
        breakpoint: 769,
        settings: 'unslick',
      },
    ],
  });

  $('.forecast-block .slider').slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    arrows: false,
    mobileFirst: true,
    slide: '.slide',
    responsive: [
      {
        breakpoint: 769,
        settings: 'unslick',
      },
    ],
  });

  $(window).resize(
    debounce(function () {
      const window_width = $(window).width();
      if (window_width < 769) {
        $('.whyus-block .slider').slick('resize');
      }
      initAccordions();
    }, 250)
  );
});
