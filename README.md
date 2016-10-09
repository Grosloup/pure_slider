#PureSlider

##HTML

```
<div class="ps-slider" id="slider2"> <!-- ps-slider -->
    <div class="ps-slides" id="slides2"> <!-- ps-slides required  -->
    
        <!-- change laps for a particular slide with  data-slide-laps="<num second>" -->
        <div id="slide10" class="ps-slide" data-slide-laps="5" style="background-image: url('...');"></div> <!-- ps-slide required -->
        <div id="slide20" class="ps-slide" data-slide-laps="4" style="background-image: url('...');">
            <!-- possible body -->
        </div>
        <div id="slide30" class="ps-slide" style="background-image: url('...');"></div>
        <div id="slide40" class="ps-slide" style="background-image: url('...');"></div>
        <div id="slide50" class="ps-slide" style="background-image: url('...');"></div>
    </div>
</div>
```

##javascript

```
var element = document.querySelector('#slider');
var options = {...};
var ps = new PureSlider(options);
ps.init(element);
```

##Options

```
{
    autoplay: false,
    laps: 3000,
    showNav: true, // bullets btn
    showBtn: true, // next and prev
    direction: 'forward', // or backward,
    currentCursorClassName: 'ps-current',
    currentSlideClassName: 'ps-current',
    slideClassName: 'ps-slide',
    slidesClassName: 'ps-slides',
    sliderNavClassName: 'ps-slider-nav',
    prevBtnClassName: 'ps-left-nav-btn',
    prevBtnHtml: 'prev', // can be html or text
    nextBtnClassName: 'ps-right-nav-btn',
    nextBtnHtml: 'next', // can be html or text
    stopOnHover: true,
    onBeforeSlideChangeCb: function () {},
    onAfterSlideChangeCb: function () {},
    onBeforeStartCb: function () {},
    onAfterStartCb: function () {},
    onBeforeStopCb: function () {},
    onAfterStopCb: function () {},
    onBeforeInitCb: function () {},
    onAfterInitCb: function () {}
}
```