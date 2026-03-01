if (!customElements.get('element-slider')) {
  class ElementSlider extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.wrapper = this.querySelector('.scroll--slider');
      this.container = this.querySelector('[scroll-slider-wrapper]');
      this.prevButton = this.querySelector('button[name="prev"]');
      this.nextButton = this.querySelector('button[name="next"]');
      this.shadowLeft = this.querySelector('.slider__shadow--left');
      this.shadowRight = this.querySelector('.slider__shadow--right');

      if (!this.container || !this.prevButton || !this.nextButton) return;

      this.updateUI();
      this.container.addEventListener('scroll', this.updateUI.bind(this));
      window.addEventListener('resize', this.updateUI.bind(this));

      this.prevButton.addEventListener('click', () => this.scrollByItem(-1));
      this.nextButton.addEventListener('click', () => this.scrollByItem(1));
    }

    scrollByItem(direction) {
      if (!this.container) return;

      const firstItem = this.container.querySelector('[scroll-slider-item]');
      if (!firstItem) return;

      const itemWidth = firstItem.offsetWidth;
      const itemMargin = parseInt(getComputedStyle(firstItem).marginRight || 0);
      const scrollAmount = (itemWidth + itemMargin) * 4;

      this.container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }

    updateUI() {
      if (!this.container) return;

      const scrollLeft = this.container.scrollLeft;
      const maxScrollLeft = this.container.scrollWidth - this.container.clientWidth;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < maxScrollLeft - 1;

      this.prevButton.disabled = !canScrollLeft;
      this.nextButton.disabled = !canScrollRight;

      if (this.shadowLeft) this.shadowLeft.style.opacity = canScrollLeft ? '1' : '0';
      if (this.shadowRight) this.shadowRight.style.opacity = canScrollRight ? '1' : '0';

      const bothDisabled = this.prevButton.disabled && this.nextButton.disabled;
      const display = bothDisabled ? 'none' : '';

      this.prevButton.style.display = display;
      this.nextButton.style.display = display;
    }
  }

  customElements.define('element-slider', ElementSlider);
}
