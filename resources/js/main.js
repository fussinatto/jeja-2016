/* jshint undef: false, unused: false */
'use strict';
// Debounced Resize() : http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function(func, threshold, execAsap) {
            var timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                };

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }
        // smartresize 
    jQuery.fn[sr] = function(fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');





var JEJA = window.JEJA || {};

JEJA.initHomePage = function() {
    // CONST
    var ISOPENCLASS = 'is-open';

    // DOM
    var $nav = $('nav');
    var $body = $('body');

    function addEL() {

        $('.menu', $nav).on('click', toggleMenu);

        //  toggling body class on home-link hover 
        $('.js-project-link')
            .hover(function() { $body.addClass('is-link-hover') }, function() { $body.removeClass('is-link-hover') })
            .click(handleListClick);

    }

    function toggleMenu(e) {
        e.preventDefault();
        $nav.toggleClass(ISOPENCLASS);
    }


    function handleListClick(e) {
        e.preventDefault();

        var trgt = this.href;
        $body.addClass('play-page-outro');

        setTimeout(function() {
            window.location.href = trgt; // allow outro animation to play till the end
        }, 400);
    }

    addEL();


};

JEJA.initProjectPage = function() {



    var _FIXEDCLASS = 'is-fixed';
    var hasClassFixed;

    var $projeImgs = $('.proj-img');

    /*
     * Center single intro
     */
    var _projectSingleIntro = $('.project-single-intro');

    if (!_projectSingleIntro.length) {
        return;
    }

    // Be sure to update when image is loaded
    var _bigProjectImg = $('.project-img img', _projectSingleIntro);

    function checkImageLoaded() {

        if (_bigProjectImg[0].complete) {

            updateLayout();

        } else {

            _projectSingleIntro.addClass('waiting');
            _bigProjectImg.on('load', updateLayout);
        }

    }
    


    var titleOldTopPos, breakpointScroll, _title, titleNewTopPos, titleHeight, _text, wrapperTop;

    function updateLayout() {

        //Scroll functions - Title
        _title = $('.project-title', _projectSingleIntro);
        
        if (titleOldTopPos === undefined || isNaN(titleOldTopPos) ) {
            titleOldTopPos = parseInt(_title.css('top'), 10);
        }

        titleHeight = _title.height();

        wrapperTop = $('.wrapper').offset().top;
        console.log(wrapperTop);

        _title.css('top', titleOldTopPos).addClass(_FIXEDCLASS); // update top position because title is fixed
        hasClassFixed = true;

        // Remove class, and show image
        _projectSingleIntro.removeClass('waiting');

        // Scroll functions - Content
        _text = $('.project-single-content');

        breakpointScroll = _text.offset().top - titleOldTopPos - titleHeight - 50; 

    }

    function handleOnScroll(e) {
        /*jshint validthis:true */
        var st = $(this).scrollTop();

        if (breakpointScroll <= st) {

            if (hasClassFixed) {
                _title.css('top', breakpointScroll + titleOldTopPos - wrapperTop).removeClass(_FIXEDCLASS);
                hasClassFixed = false;
            }

        } else {
            if (!hasClassFixed) {
                _title.css('top', titleOldTopPos ).addClass(_FIXEDCLASS); // 100 = header
                hasClassFixed = true;
            }
        }

        $projeImgs.each(function() {
            $(this)[isScrolledIntoView(this) === true ? 'addClass' : 'removeClass']('in-view')
        });


    }

    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height() * 0.2;

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }




    function initScrollAnimation () {

        if($('head').css("font-family") !== "phone"){
            updateLayout();

            $(window).on('scroll', handleOnScroll);

            //ON RESIZE

        } else {
             $(window).off('scroll', handleOnScroll);
        }
    }


    function init () {
        checkImageLoaded();   

        $(window).smartresize(updateLayout);
        $(window).smartresize(initScrollAnimation);
        initScrollAnimation()

    }

    init();

}

JEJA.initNewsPage = function() {

    var $newsLinks = $('.js-news-link');

    var _OFFSET = 100; // 140 = wrapper offset

    var handleNewsClick = function(e) {

        // Scroll
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - _OFFSET // 140 = wrapper offset
                }, 1000);
                return false;
            }
        }
    }

    function handleScroll(event) {
        var scrollPos = $(document).scrollTop() + _OFFSET; // 140 = wrapper offset

        $newsLinks.each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $newsLinks.removeClass("is-active");
                currLink.addClass("is-active");
            } else {
                currLink.removeClass("active");
            }
        });
    }

    $newsLinks.click(handleNewsClick);
    $(window).on('scroll', handleScroll);
    handleScroll();
}

JEJA.initSharedFn = function() {

    var $body = $('body');


    function handleMenuClick(e) {
        e.preventDefault();

        var trgt = this.href;
        $body.addClass('play-page-outro');

        setTimeout(function() {
            window.location.href = trgt;
        }, 400);
    }

    $('.js-nav-link').click(handleMenuClick);


    function handleScroll(e) {
        var st = $(this).scrollTop();

        if (st <= 12) { // 12px - just to give some room
            $body.addClass('is-scrolled-ontop');
        } else {
            $body.removeClass('is-scrolled-ontop');
        }

        if(st + window.innerHeight + 5 >= $body.height()){
             $body.addClass('is-scrolled-onbottom');
        } else {
            $body.removeClass('is-scrolled-onbottom');
        }
    }

    function scrollToTop() {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    }
    //ON SCROLL
    $('.js-scroll-top').click(scrollToTop)
    $(window).on('scroll', handleScroll);

    handleScroll();

}

$(function() {


    if ($('body').hasClass('is-home-page')) {

        JEJA.initHomePage();

    } else if ($('body').hasClass('is-news-page')) {

        JEJA.initNewsPage();
    } else {

        JEJA.initProjectPage();
    }


    JEJA.initSharedFn()



    $('.fancybox').fancybox();


});
