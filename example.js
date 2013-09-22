
var app;

$(function(){	

    /* NAVIGATION AND OTHER APP WIDE INTERFACE ELEMENTS */
    UI = function(){
        var obj = this;
        this.el = $('.ui')
        this.nav = $('#js-nav', app.body);
    
        this.init = function(){
            
            app.body.on('changeScreen', this.onChangeScreen);

            // Current totals bar (hover)
            obj.el.filter('.current-totals')
                .hover(
                    function(){
                        $('.panel').addClass('off-screen');
                        obj.el.filter('.current-totals').addClass('open');
                    },
                    function(){
                        obj.el.filter('.current-totals').removeClass('open');
                    }
                );

            // Current totals bar (click)
            $('.total-wrap', app.body)
                .on('click', function(e){
                    $('.panel').addClass('off-screen');
                    $('.current-totals', app.body).toggleClass('open');
                });
            
            // Go to RESULTS NOW!
            $('#kick-habits-now', app.body).on('click', function(e){
                e.preventDefault();
                obj.hideUi();
                app.goToScreen('results');
            });

            // Footer panels
            $('#js-footer', app.body)
                .find('.panel')
                    .hover(
                        function(e){ 
                            if (app.isIE) return;
                            $('.current-totals', app.body).removeClass('open');

                            var panel = $(e.target).closest('.panel');

                            if (panel.hasClass('social')) {
                                app.body.trigger('openSocialPanel');
                            }

                            panel
                                .removeClass('off-screen')
                                .siblings('.panel').addClass('off-screen');
                        },
                        function(e){  
                            if (app.isIE) return;
                            $('.current-totals', app.body).removeClass('open');
                            $(e.target).closest('.panel')
                                .addClass('off-screen');
                        }
                    )
                    .on('click', '.tab, .click-to-close', function(e){
                        e.preventDefault();
                        $('.current-totals', app.body).removeClass('open');
                        $(e.target).closest('.panel')
                            .toggleClass('off-screen')
                            .siblings('.panel').addClass('off-screen');
                    });
        }
        this.onChangeScreen = function(e, screen){
            
            // Initialise the navigation
            (screen == 'takeaways') ? app.nav.find('.prev').addClass('disabled') : app.nav.find('.prev').removeClass('disabled');
            (screen == 'evenings') ? app.nav.find('.next').addClass('disabled') : app.nav.find('.next').removeClass('disabled');

            obj.closeAllTabs();
        }
        this.closeAllTabs = function(){
            if ($('.current-totals.open').length) {
                $('.total-wrap').click();
            }
            $('.panel').addClass('off-screen');
        }
        this.hideUi = function(){
            obj.closeAllTabs();
            obj.el.addClass('off-screen');
        }    
        this.init();
    }

    TWITTERBTN = function(el){
        var obj = this;
        this.el = $('#twitter-btn');
        this.url = 'http://www.leedsbuildingsociety.co.uk/resources/kick-my-habits/';
        this.prevTotal = 0;

        this.init = function(){
            app.body.on('openSocialPanel', this.createTwitterBtn);
        }
        this.createTwitterBtn = function(e, location){
            
            if (app.totalSpend <= 0 ||  obj.prevTotal == app.yearlySaving) {
                return;
            }

            obj.el.find('iframe').remove();

            var tweet = "I could save "+app.yearlySaving+"GBP per year if I kick my habits. Find out how much you could save! #LBS",
                btn = $('<a></a>')
                .addClass('twitter-share-button')
                .attr('href', 'http://twitter.com/share')
                .attr('data-url', obj.url)
                .attr('data-text', tweet)
                .attr('data-count', 'vertical');

            obj.el.html('');
            obj.el.append(btn);

            twttr.widgets.load();

            obj.prevTotal = app.yearlySaving;
        }
        this.init();
    }

    /* START SCREEN */
    START = function(el){
        var obj = this;
        this.el = $(el);
        this.habitsWrap = $('#start-habits-wrap', this.el);
        this.leg        = $('#start-leg', this.el);
    
        this.init = function(){

            app.goToScreen('start');

            // Listen for animation ends within the start screen
            obj.el.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', this.onTransitionEnd);

            $('.get-started', app.body)
                .on('click', this.animateOut)
                .hover(
                    function(){ $('.arrow', obj.el).addClass('faster'); },
                    function(){ $('.arrow', obj.el).removeClass('faster'); }
                )

            // Animate the leg in (after short pause)
            setTimeout(function(){ 
                if (Modernizr.csstransitions) {
                    // CSS                    
                    obj.leg.removeClass('off-screen').addClass('stamp');

                } else {
                    // JS fallback
                    obj.leg
                        .animate({'top':'50%'}, 200, 
                            function(){
                                obj.leg.removeClass('off-screen');
                                $('#js-nav').removeClass('off-screen');
                                $('.get-started, .navigation', app.body).fadeIn('slow');
                            }
                        );
                }
                // remove preloader
                $('#preload-wrap').remove();
            }, 1000);
        }
        this.onTransitionEnd = function(e){
            e.stopPropagation();

            // haven't started yet!
            if (obj.leg.hasClass('off-screen')) return;

            // FOOT - stamp down complete
            if ( $(e.target).attr('id')=='start-leg' && $(e.target).hasClass('stamp')) {
                
                obj.habitsWrap.find('img').addClass('jump-up');    // make habits jump
                obj.el.find('h1.circ, h2, p').addClass('jump-up');
                $(e.target).removeClass('stamp');
                return;
            }

            // JUMP-UP complete
            if ( $(e.target).hasClass('jump-up') ) {
                setTimeout(function(){
                    $(e.target).addClass('fall-down').removeClass('left right');
                    setTimeout(function(){
                        $(e.target).attr('data-state', 'upcomplete');
                    }, 100);
                }, 60);
            }

            // FALL-DOWN complete
            if ( $(e.target).attr('data-state')=='upcomplete' && $(e.target).hasClass('fall-down')) {
                $(e.target).addClass('bounce');

                // Bring 'get-started' UI elements in
                $('#js-nav', app.body).removeClass('off-screen');
                obj.el.find('div.get-started').addClass('show');
            }
        }
        this.animateOut = function(e){
            
            e.preventDefault();

            if (Modernizr.csstransitions) {
                
                // CSS
                obj.el.addClass('animate-out');
                
                $('#habit-screens-wrap', app.body)
                    .removeClass('off-screen')
                    .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(){
                        
                        // delete the start screen once it is out of view + get started button in nav
                        obj.el.add('.get-started', app.body).add('.arrow', obj.el).add('#js-nav .arrow-2').remove();
                        
                        app.nav.removeClass('off-screen');
                        app.goToScreen('takeaways');

                        $('#habit-screens-wrap').off();
                    });
                
                $('#js-nav', app.body).addClass('off-screen');

            } else {
                
                // JS?
                obj.el.fadeOut(function(){
                    obj.el.add('.get-started', app.body).add('.arrow', obj.el).add('#js-nav .arrow').remove();
                    app.goToScreen('takeaways');

                    $('#habit-screens-wrap', app.body).removeClass('off-screen');
                });
            }
        }
        this.init();
    }

    /* RESULTS SCREEN */
    RESULTS = function(){
        var obj = this;
        this.el = $('#results-screen');
    
        this.init = function(){

            app.body
                .on('changeScreen', this.onChangeScreen)
                .on('removeResults', this.removeResults)

            this.el.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', this.onTransitionEnd);

            // Kick my habits - circle link
            obj.el.find('a.kick-habits-btn')
                .hover(
                    function(){ obj.el.find('#results-leg').addClass('raised'); },
                    function(){ obj.el.find('#results-leg').removeClass('raised'); }
                )
                .on('click', function(e){
                    e.preventDefault();

                    if (Modernizr.csstransitions) {
                        // CSS
                        obj.el.addClass('kicked')
                            .find('#results-leg')
                                .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e){
                                    if ($(e.target).hasClass('kick-it')) $(e.target).removeClass('kick-it');
                                    $(this).off();

                                    setTimeout(obj.showFinalFigures, 1000);
                                })
                                .removeClass('raised').addClass('kick-it').end();
                    } else {
                        // JS
                        obj.el.addClass('kicked')
                            .find('#results-leg').removeClass('raised').addClass('kick-it');
                        setTimeout(function(){ 
                            obj.el.removeClass('kicked')
                                .find('#results-leg').removeClass('kick-it');

                            obj.showFinalFigures();
                        }, 300);
                    }
                });

            obj.el.find('#final-totals')
                .on('click', 'li', function(e){
                    obj.removeResults();
                    var scr = $(e.target).closest('li').attr('class');
                    app.goToScreen(scr);
                });
        }
        this.onTransitionEnd = function(e){
            e.stopPropagation();

            // Close fingers on hand? - add data-ontransend class to screen
            if ($(e.target).attr('data-ontransend')) {
                obj.el.addClass($(e.target).attr('data-ontransend'));
            }
        }
        this.onChangeScreen = function(e, screen){
            
            if (screen == 'results') {

                obj.el.addClass('animate-in');
                // Show back button
                $('#js-nav').removeClass('off-screen');
                $('#habit-screens-wrap').addClass('off-screen');
            
            } else {

                //$('#habit-screens-wrap').addClass('animate-in');
            }
        }
        this.showFinalFigures = function(){
            obj.el.addClass('final-figures');
        }
        this.removeResults = function(){
            obj.el.attr('class', 'screen results');
            $('#js-nav').add('.current-totals').add('.habit-screens-wrap').removeClass('off-screen');
        }
        this.init();
    }

    /* HABIT SCREEN class */
    HABITSCREEN = function(el){
        var obj = this;
        this.el = $(el);
        this.name = this.el.attr('data-screen');
        this.pieChart = this.el.find('.pie-chart-wrap');
        this.spend = 0;
        this.slice = '';
        this.range = '';
    
        this.init = function(){
            
            app.body.on('changeSlice', this.onChangeSlice);
            obj.el.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', this.onTransitionEnd);

            // Initiate the slider for this screen
            var sliderDefault = this.el.find('.slider').attr('data-default'),
                sliderMax = this.el.find('.slider').attr('data-max');

            this.el
                .find('.slider').slider({
                    value: parseInt(sliderDefault),
                    min: 0,
                    max: sliderMax,
                    slide: obj.onSlide,
                    start: function(e){
                        $('.ui-slider-handle', obj.el).addClass('dragging');
                        obj.el.addClass('dragging');
                    },
                    stop: function(e){
                        $('.ui-slider-handle', obj.el).removeClass('dragging');
                        obj.el.removeClass('dragging');
                    },
                    create: function( event, ui ) {
                        $('.ui-slider-handle', obj.el).html( '&pound;'+sliderDefault );
                    }
                }).end()
                .find('.admit-it').on('click', 'a', this.onAdmitItClick);

            obj.spend = sliderDefault;
        }
        this.onTransitionEnd = function(e){
            e.stopPropagation();

            // Close fingers on hand? - add data-ontransend class to screen
            if ($(e.target).attr('data-ontransend')) {
                obj.el.addClass($(e.target).attr('data-ontransend'));
            }
        }
        this.onAdmitItClick = function(e){
            e.preventDefault();
            if ($(e.target).hasClass('i-do')) {
                
                $(e.target)
                    .closest('.i-do').attr('data-ontransend', 'i-do')
                    .closest('.admit-it').addClass('shrink');

                if (!Modernizr.csstransitions) {
                    obj.el.addClass('i-do');
                }

                // Trigger the slider and pie chart into default position
                obj.pieChart.removeClass('show-average');
                obj.el.find('.slider').slider( "values", obj.spend );
                obj.onSlide(null, null, obj.spend);

            } else {
                obj.el.removeClass('i-do').addClass('i-dont');
                $('#js-nav').find('.next').click();
            }
        }
        this.onSlide = function(e, ui, val){
            
            obj.spend = (!e) ? Number(val) : Number(ui.value);
            $('.ui-slider-handle', obj.el).html( '&pound;'+obj.spend );

            var slice, range;
            if (obj.spend == 0) { 
                slice = 'slice-1';
                range = '&pound;0';
            } else if (obj.spend <=5) { 
                slice = 'slice-2';
                range = 'around &pound;2.50';
            } else if (obj.spend <=11) { 
                slice = 'slice-3';
                range = 'around &pound;7.50'; 
            } else if (obj.spend <=19) { 
                slice = 'slice-4';
                range = 'around &pound;15'; 
            } else if (obj.spend <=29) { 
                slice = 'slice-5'; 
                range = 'around &pound;25';
            } else if (obj.spend <=39) { 
                slice = 'slice-6';
                range = 'around &pound;35';
            } else if (obj.spend <=54) { 
                slice = 'slice-7';
                range = 'around &pound;45';
            } else if (obj.spend <=74) { 
                slice = 'slice-8';
                range = 'around &pound;63';
            } else if (obj.spend <=100) { 
                slice = 'slice-9';
                range = 'around &pound;88';
            }

            // Are we changing currently selected range?
            if (slice !== obj.slice) {
                obj.slice = slice;
                obj.range = range;
                app.body.trigger('changeSlice', slice);
            }

            app.updateTotals();
        }
        this.onChangeSlice = function(e, slice){
            
            if (app.body.attr('data-screen') !== obj.name) return;

            obj.slice = slice;

            obj.el.removeClass('slice-1 slice-2 slice-3 slice-4 slice-5 slice-6 slice-7 slice-8 slice-9').addClass(obj.slice);

            // Update number in center of pie + explanatory text
            var perc = obj.el.find('li.'+obj.slice).attr('data-percent');
            obj.pieChart
                .find('.percent, .number').html(perc+'<span class="perc">%</span>')
                .filter('.number').addClass('pulse');
            obj.pieChart
                .find('.range').html(obj.range);

            setTimeout(function(){ obj.pieChart.find('.number').removeClass('pulse') }, 210);
        }
        this.init();
    }

    /* TAKEAWAYS SCREEN */
    TAKEAWAYS = function(el){
        var obj = this;
        this.el = $(el);
    
        this.init = function(){
            app.body.on('changeSlice', this.onChangeSlice);
        }
        this.onChangeSlice = function(e){
            if (app.body.attr('data-screen') !== 'takeaways') return;
            
            if (Modernizr.csstransitions) {
                // CSS   
                obj.el
                    .addClass('twist')
                    .on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e){
                        if ($(e.target).hasClass('noodles-wrap')) {
                            obj.el.removeClass('twist');
                        }
                    });
            } else {
                // JS
                obj.el.addClass('twist');
                setTimeout(function(){ obj.el.removeClass('twist'); }, 300);
            }
        }
        this.init();
    }

    /* MAIN APPLICATION CLASS */
    app = {
        body            : $('#js-body'),
        nav             : $('#js-nav', this.body),
        habitScreens    : new Array(),
        totalSpend      : 0,
        yearlySaving    : 0,
        isIE            : $.browser.msie,

        init: function(){

            if (app.isIE) app.body.addClass('isIE');

            // disable tabbing
            $("a, input").not('.ui .tab').attr("tabindex", "-1");

            app.ui = new UI();
            new TWITTERBTN();

            // Habit Screen objects - shared functionality
            this.habitScreens.push(
                new HABITSCREEN('#takeaways'),
                new HABITSCREEN('#booze'),
                new HABITSCREEN('#cigarettes'),
                new HABITSCREEN('#nights-out'),
                new HABITSCREEN('#fashion'),
                new HABITSCREEN('#lunches'),
                new HABITSCREEN('#tech'),
                new HABITSCREEN('#evenings')
            );

            // Screen objects - screen specific functionality
            new RESULTS();
            new TAKEAWAYS('#takeaways');

            // Navigation between habits
            $('#js-nav', app.body).on('click', '.tab', this.onNavClick);

            // Run on load
            $(window)
                .on('load', function(){
                    $('.preload').addClass('off-screen');
                    setTimeout(function(){
                        app.startScreen = new START('#start-screen');
                    }, 1000);
                })
                .on('scroll', function(e){
                    e.preventDefault();
                });			
        },
        onNavClick: function(e){
            e.preventDefault();
            
            var tab = $(e.target).closest('.tab');

            // Last habit - next = results page
            if (tab.hasClass('next') && tab.closest('#js-body').hasClass('evenings')) {
                app.ui.hideUi();
                $('#js-nav').removeClass('off-screen');
                app.goToScreen('results');
                return;
            }

            // Back button on results page?
            if (tab.hasClass('back')) {
                app.body.trigger('removeResults');
                app.goToScreen(app.currentHabit);
            }

            if (tab.hasClass('disabled')) {
                return;

            } else if (tab.hasClass('prev')) {
                // Go PREVIOUS
                var prev = $('.screen.current').prev().attr('data-screen');
                app.goToScreen(prev);

            } else if (tab.hasClass('next')) {
                
                $('#arrow-first-habit', app.body).remove();

                // Go NEXT
                var next = $('.screen.current').next().attr('data-screen');
                app.goToScreen(next);
            } 
        },
        updateTotals: function(){
            var total = 0;
            for (var i=0, l=this.habitScreens.length; i<l; i++) {
                // Calculate overall total
                total += parseInt(this.habitScreens[i].spend, 10) || 0;
                // Update totals on result screen header
                $('#final-totals').find('li.'+this.habitScreens[i].name).find('.total').html(this.habitScreens[i].spend);
            }
            $('#total-spend').add('.weekly-saving .number').html('&pound;'+total);

            app.totalSpend = total;
            
            // Update final results screen totals
            var yTot = (total*52).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                intTot = ((total*52)*0.0165);
            intTot = (intTot > 99.99) ? Math.round(intTot).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : intTot.toFixed(2);
            $('#savings-info-wrap')
                .find('.yearly-saving .number').html('&pound;'+yTot).end()
                .find('.potential-interest .number').html('&pound;'+intTot+'<sup>*</sup>');

            app.yearlySaving = yTot;
        },
        goToScreen: function(screen){

            var removeHabitClasses;
            if ('loading start takeaways booze cigarettes nights-out fashion lunches tech evenings'.indexOf(screen) > -1) {
                
                // LOADING / START / HABIT screen
                if (screen !== 'start') {
                    $('#habit-screens-wrap', app.body)
                        .removeClass('takeaways booze cigarettes nights-out fashion lunches tech evenings')
                        .addClass(screen);
                }

                removeHabitClasses = 'current previous-screen hand-closed';
            
            } else if ('results'.indexOf(screen) > -1) {

                // RESULTS screen
                removeHabitClasses = 'previous-screen hand-closed';
                var prev = app.body.find('.screen.current');
                setTimeout(function(){ prev.removeClass('current'); }, 1000);
            }

            var scr = app.body
        		// body
                .removeClass('loading start takeaways booze cigarettes nights-out fashion lunches tech evenings results current')
        		.addClass(screen)
        		.attr('data-screen', screen)
                .trigger('changeScreen', screen)
                // screens
                .find('.screen').removeClass(removeHabitClasses)
                .filter('[data-screen="'+screen+'"]').addClass('current');

            scr.prev('.habit').addClass('previous-screen');

            // Keep track of the previous habit
            if (scr.hasClass('habit')) app.currentHabit = screen;

            if (!Modernizr.csstransitions) {
                scr.addClass('hand-closed');
            }
        }
    }

    /* RUN APPLICATION ! */ 
    app.init();
});