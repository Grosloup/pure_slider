function whichTransitionEnd() {
    var t, el = document.createElement('div'), transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd',
        'MSTransition': ''
    };
    for(t in transitions){
        if( el.style[t] !== undefined ){
            el = null;
            return transitions[t];
        }
    }
    el = null;
    return null;
}
function whichAnimationEnd() {
    var t, el = document.createElement('div'), animations = {
        'animation':'animationend',
        'OAnimation':'oAnimationEnd',
        'MozAnimation':'animationend',
        'WebkitAnimation':'webkitAnimationEnd',
        'MSAnimation':'MSAnimationEnd'
    };
    for(t in animations){
        if( el.style[t] !== undefined ){
            el = null;
            return animations[t];
        }
    }
    el = null;
    return null;
}

function whichAnimationStart() {
    var t, el = document.createElement('div'), animations = {
        'animation':'animationstart',
        'OAnimation':'oAnimationStart',
        'MozAnimation':'animationstart',
        'WebkitAnimation':'webkitAnimationStart',
        'MSAnimation':'MSAnimationStart'
    };
    for(t in animations){
        if( el.style[t] !== undefined ){
            el = null;
            return animations[t];
        }
    }
    el = null;
    return null;
}

var tee = whichTransitionEnd(), aee = whichAnimationEnd(), ase = whichAnimationStart();