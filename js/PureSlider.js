var PureSlider = (function () {
    var _extend = function (obj) {
        var length = arguments.length;
        if (length < 2 || obj == null) {
            return obj;
        }
        function allKeys(obj) {
            var keys = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    keys.push(prop);
                }
            }
            return keys;
        }

        for (var index = 1; index < length; index++) {
            var sourceObj = arguments[index],
                keys = allKeys(sourceObj);
            for (var i = 0; i < keys.length; i++) {
                obj[keys[i]] = sourceObj[keys[i]];
            }
        }
        return obj;
    };
    var DEFAULTS = {
        autoplay: false,
        laps: 3000,
        showNav: true,
        showBtn: true,
        direction: 'forward', // backward,
        currentCursorClassName: 'ps-current',
        currentSlideClassName: 'ps-current',
        slideClassName: 'ps-slide',
        slidesClassName: 'ps-slides',
        sliderNavClassName: 'ps-slider-nav',
        prevBtnClassName: 'ps-left-nav-btn',
        prevBtnHtml: 'prev',
        nextBtnClassName: 'ps-right-nav-btn',
        nextBtnHtml: 'next',
        stopOnHover: true,
        onBeforeSlideChangeCb: function () {
        },
        onAfterSlideChangeCb: function () {
        },
        onBeforeStartCb: function () {
        },
        onAfterStartCb: function () {
        },
        onBeforeStopCb: function () {
        },
        onAfterStopCb: function () {
        },
        onBeforeInitCb: function () {
        },
        onAfterInitCb: function () {
        }
    };
    function PureSlider(options) {
        this.options = _extend({}, DEFAULTS, options);
        this.vars = {
            slider: null,
            slides: [],
            sliderNav: null,
            currentSlide: null,
            currentCursor: null,
            currentDefined: false,
            cursors: [],
            index: 0,
            max: 0,
            rotate: true,
            interval: null,
            isStarted: false,
            hasNav: false,
            prevBtn: null,
            nextBtn: null,
            hasBtn: false,
            direction: this.options.direction,
            slidesLaps: [],
            loader: null
        }
    }



    PureSlider.prototype = {
        init: function (element) {
            this.options.onBeforeInitCb(this);
            this.vars.slider = element;
            this.vars.slides =
                [].slice.call(
                    this.vars.slider.querySelector('.' + this.options.slidesClassName).children
                );
            this.vars.max = (this.vars.slides.length - 1);
            this.createLoader();
            var totalLoaded = 0, self = this, totalToLoad = this.vars.slides.length;
            this.vars.slides.forEach(function (item, idx) {
                var img = document.createElement('img');
                img.addEventListener('load', function (e) {
                    img = null;
                    totalLoaded++;
                    if (totalLoaded == totalToLoad) {
                        self.initAfterLoading();
                    }
                });
                img.src = getComputedStyle(item).backgroundImage.slice(4, -1).replace(/"/g, "");
            });
        },
        createLoader: function () {
            this.vars.loader = document.createElement('div');
            this.vars.loader.innerHTML = '<div class="ps-double-bounce1"></div><div class="ps-double-bounce2"></div>';
            this.vars.loader.classList.add('ps-loader');
            this.vars.slider.appendChild(this.vars.loader);
        },
        destroyLoader: function () {
            this.vars.slider.removeChild(this.vars.loader);
            this.vars.loader = null;
        },
        initAfterLoading: function () {
            this.destroyLoader();
            this.vars.slides.forEach(function (item, idx) {
                if (item.classList.contains(this.options.currentSlideClassName)) {
                    if (this.vars.currentDefined) {
                        item.classList.remove(this.options.currentSlideClassName)
                    } else {
                        this.vars.currentDefined = true;
                        this.vars.index = idx;
                        this.vars.currentSlide = item;
                    }
                }
                if (item.hasAttribute('data-slide-laps')) {
                    this.vars.slidesLaps.push((parseInt(item.getAttribute('data-slide-laps')) * 1000));
                } else {
                    this.vars.slidesLaps.push(this.options.laps);
                }
            }, this);
            if (!this.vars.currentDefined) {
                this.vars.slides[0].classList.add(this.options.currentSlideClassName);
                this.vars.currentSlide = this.vars.slides[0];
            }
            if (this.options.showBtn) {
                this.buildBtn();
                if (this.vars.hasBtn) {
                    this.initBtnEvents();
                }
            }
            if (this.options.showNav) {
                this.buildNav();
            }
            if (this.options.autoplay) {
                this.vars.rotate = true;
            }
            this.setStopOnHover();
            this.start();
            this.options.onAfterInitCb(this);
        },
        setStopOnHover: function () {
            if (this.options.stopOnHover && this.options.autoplay) {
                var self = this;
                this.vars.slider.addEventListener('mouseenter', function (evt) {
                    evt.preventDefault();
                    self.stop();
                });
                this.vars.slider.addEventListener('mouseleave', function (evt) {
                    evt.preventDefault();
                    var to = window.setTimeout(function () {
                        window.clearTimeout(to);
                        if (self.vars.direction === 'forward') {
                            self.next(true);
                        } else {
                            self.prev(true);
                        }
                    }, self.options.laps / 2);
                });
            }
        },
        buildBtn: function () {
            this.vars.prevBtn = document.createElement('button');
            this.vars.prevBtn.innerHTML = this.options.prevBtnHtml;
            this.vars.prevBtn.classList.add(this.options.prevBtnClassName);
            this.vars.slider.appendChild(this.vars.prevBtn);
            this.vars.nextBtn = document.createElement('button');
            this.vars.nextBtn.innerHTML = this.options.nextBtnHtml;
            this.vars.nextBtn.classList.add(this.options.nextBtnClassName);
            this.vars.slider.appendChild(this.vars.nextBtn);
            this.vars.hasBtn = true;
        },
        buildNav: function () {
            var div = document.createElement('div');
            div.classList.add(this.options.sliderNavClassName);
            var ul = document.createElement('ul');
            this.vars.slides.forEach(function (item, idx) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                if (item.classList.contains(this.options.currentSlideClassName)) {
                    a.classList.add(this.options.currentCursorClassName);
                    this.vars.currentCursor = a;
                    this.vars.index = idx;
                }
                a.addEventListener('click', this.onClickCursorEvent.bind(this));
                this.vars.cursors.push(a);
                li.appendChild(a);
                ul.appendChild(li);
            }, this);
            div.appendChild(ul);
            this.vars.slider.appendChild(div);
            this.vars.hasNav = true;
        },
        initBtnEvents: function () {
            var self = this;
            this.vars.nextBtn.addEventListener('click', function (evt) {
                evt.preventDefault();
                self.next();
            });
            this.vars.prevBtn.addEventListener('click', function (evt) {
                evt.preventDefault();
                self.prev();
            });
        },
        onClickCursorEvent: function (evt) {
            evt.preventDefault();
            this.stop();
            var t = evt.target;
            var idx = this.vars.cursors.indexOf(t);
            this.gotoSlide(idx);
            this.start();
        },
        gotoSlide: function (idx) {
            if (idx === null || idx == undefined) {
                idx = this.vars.index;
            }
            if (this.vars.slides[idx] && this.vars.currentSlide !== this.vars.slides[idx]) {
                this.vars.index = idx;
                if (this.vars.hasNav) {
                    this.vars.currentCursor.classList.remove(this.options.currentCursorClassName);
                    this.vars.currentCursor = this.vars.cursors[this.vars.index];
                    this.vars.currentCursor.classList.add(this.options.currentCursorClassName);
                }
                this.vars.currentSlide.classList.remove(this.options.currentSlideClassName);
                this.vars.currentSlide = this.vars.slides[this.vars.index];
                this.vars.currentSlide.classList.add(this.options.currentSlideClassName);
            }
        },
        next: function (rotate) {
            this.stop();
            if (rotate === null || rotate == undefined) {
                rotate = this.vars.rotate
            }
            this.vars.index += 1;
            if (this.vars.index > this.vars.max) {
                if (rotate === true) {
                    this.vars.index = 0;
                } else {
                    this.vars.index = this.vars.max;
                }
            }
            this.gotoSlide();
            this.start();
        },
        prev: function (rotate) {
            this.stop();
            if (rotate === null || rotate == undefined) {
                rotate = this.vars.rotate
            }
            this.vars.index -= 1;
            if (this.vars.index < 0) {
                if (rotate === true) {
                    this.vars.index = this.vars.max;
                } else {
                    this.vars.index = 0;
                }
            }
            this.gotoSlide();
            this.start();
        },
        start: function () {
            if (!this.options.autoplay) {
                return;
            }
            this.options.onBeforeStartCb(this);
            this.vars.isStarted = true;
            var self = this;
            this.vars.interval = window.setInterval(function () {
                if (self.vars.direction === 'forward') {
                    self.next(self.vars.rotate);
                } else {
                    self.prev(self.vars.rotate);
                }
                self.options.onAfterStartCb(this);
            }, this.vars.slidesLaps[this.vars.index]);
        },
        stop: function () {
            this.options.onBeforeStopCb(this);
            this.vars.isStarted = false;
            if (this.vars.interval != null) {
                window.clearInterval(this.vars.interval);
                this.vars.interval = null;
            }
            this.options.onAfterStopCb(this);
        }
    };
    return PureSlider;
})();