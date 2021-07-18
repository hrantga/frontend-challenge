class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof (element) === 'string' ? document.querySelector(element) : element;
        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
            if (this.xDiff > 0) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if (this.yDiff > 0) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    touchStart (evt) {
        this.xDown = evt.touches[0].clientX;
        this.yDown = evt.touches[0].clientY;
    }


    touchMove (evt) {
        this.handleTouchMove(evt);
    }

    subscribe() {
        this.element.addEventListener('touchstart', this.touchStart, false);
        this.element.addEventListener('touchmove', this.touchMove, false);
    }

    destroy() {
        this.element.removeEventListener('touchstart', this.touchStart, false);
        this.element.removeEventListener('touchmove', this.touchMove, false);
        this.onDown = this.onUp = this.onLeft = this.onRight = null;
    }
}

class Slider {
    constructor(element) {
        this.element = element;
        this.wrapper;
        this.sliders;
        this.count;
        this.current = 1;
    }

    init() {
        this.sliders = document.getElementsByClassName('slide');
        this.wrapper = document.querySelector('.slides-wrapper');
        this.count = this.sliders.length;
        const { offsetWidth } = this.sliders[0];
        this.slideLeft = this.slideLeft.bind(this);
        this.slideRight = this.slideRight.bind(this);
        // this.wrapper.style.width = offsetWidth * this.count + 'px';
        this.element.getElementsByClassName('slide-left-arrow')[0].addEventListener('click', this.slideLeft);
        this.element.getElementsByClassName('slide-right-arrow')[0].addEventListener('click', this.slideRight);
        window.addEventListener('resize', () => this.setSlidePosition());        
    }

    slideLeft() {
        if (this.current === this.count) {
            return
        }
        this.sliders[this.current].classList.add('slide-right');
        this.wrapper.style.right = this.current * this.sliders[0].offsetWidth + "px";
        this.current++;
        //clean up slide-left class names from slides
        for (let el of this.sliders) {
            if (el.classList.contains('slide-left')) {
                el.classList.remove('slide-left');
            }
        }
    }

    slideRight() {
        if (this.current === 1) {
            return
        }
        this.sliders[this.current - 2].classList.add('slide-left');
        this.current--;
        this.wrapper.style.right = this.current === 1 ? "0px" : (this.current - 1) * this.sliders[0].offsetWidth + "px";
        //clean up slide-right class names from slides
        for (let el of this.sliders) {
            if (el.classList.contains('slide-right')) {
                el.classList.remove('slide-right');
            }
        }
    }

    destroy() {
        this.element.classList.remove('slide-left');
        this.element.classList.remove('slide-right');
        this.element.getElementsByClassName('slide-lefy-arrow')[0].removeEventListener('click', this.slideLeft);
        this.element.getElementsByClassName('slide-right-arrow')[0].removeEventListener('click', this.slideRight);
    }

    setSlidePosition() {
        if (this.current === 1) {
            return
        }
        this.wrapper.style.right = (this.current - 1) * this.sliders[0].offsetWidth + "px";

    }
}

function createSlider(elementId) {
    const el = document.getElementById(elementId)
    const swiper = new Swipe(el);
    const slider = new Slider(el);
    swiper.onLeft(() => slider.slideLeft());
    swiper.onRight(() => slider.slideRight());

    swiper.subscribe();
    slider.init();

    return () => {
        swiper.destroy();
        slider.destroy();
        swiper = null;
        slider = null;
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    createSlider('slides');
})