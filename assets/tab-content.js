if (!customElements.get('product-tabs')) {
  class ProductTabs extends HTMLElement {
    constructor() {
      super();
      this.selectors = {
        button: '[tab-button]',
        content: '[tab-content]',
        mainContainer: '.prod-tabs'
      };
      this.activeButton = null;
      this.activeContent = null;
      this.init();
    }

    init() {
      this.buttons = Array.from(this.querySelectorAll(this.selectors.button));
      this.contents = Array.from(this.querySelectorAll(this.selectors.content));
      this.mainContainer = this.querySelector(this.selectors.mainContainer);

      if (!this.buttons.length || !this.contents.length) return;

      // Expand the first tab on load
      this.activateTab(this.buttons[0]);

      this.buttons.forEach(button => {
        button.addEventListener('click', () => {
          this.activateTab(button);
        });
      });
    }

    activateTab(button) {
      if (this.activeButton === button) return;

      // Remove active state from previous button and content
      if (this.activeButton) this.activeButton.classList.remove('active');
      if (this.activeContent) {
        this.activeContent.classList.remove('active');
        this.activeContent.style.setProperty('--max-height', '0px');
      }

      // Add active state to current button
      button.classList.add('active');
      this.activeButton = button;

      // Show corresponding content
      const id = button.dataset.id;
      const content = this.contents.find(el => el.dataset.id === id);
      if (content) {
        content.classList.add('active');
        // Use --max-height CSS variable for smooth expansion
        console.log(content);

        content.style.setProperty('--max-height', (content.scrollHeight + 64) + 'px');
        this.activeContent = content;
      }
    }
  }

  customElements.define('product-tabs', ProductTabs);
}