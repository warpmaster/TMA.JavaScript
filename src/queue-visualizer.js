export default class QueueVisualizer {
    _element;
    _subElements = {};
    _data = [];
    _maxInputLength;
    _maxQueueItems;

    constructor(maxQueueItems = 20, maxInputLength = 32) {
        this._maxQueueItems = maxQueueItems;
        this._maxInputLength = maxInputLength;
    }

    getTemplate() {
        return `<div class="queue-visualizer">
                  <div class="header">
                    <h1>Visualization of a basic queue</h1>
                  </div>
                  <div class="control-elements">
                      <div class="input-box">
                        <input type="text" data-element="queueDataInput" class="queue-data-input" placeholder="Input text here">
                        <div class="input-error" data-element="errorMessage"></div>
                      </div>  
                      <div class="buttons-box">
                        <button type="button" data-element="enqueueButton" class="enqueue-button">
                          <span>Enqueue</span>
                        </button>
                        <button type="button" data-element="dequeueButton" class="dequeue-button">
                          <span>Dequeue</span>
                        </button>
                      </div>
                  </div>
                  <div data-element="queueContainer" class="queue-container"></div>
                </div>`;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this._element = wrapper.firstElementChild;

        this._subElements = this.getSubElements();
        this.addEventListeners();

        return this._element;
    }

    getSubElements() {
        return [...this._element.querySelectorAll("[data-element]")]
            .reduce((prev, item) => {
                prev[item.dataset.element] = item;
                return prev;
            }, {});
    }

    addEventListeners() {
        this._subElements.enqueueButton.addEventListener("click", () => {
            const inputLength = this._subElements.queueDataInput.value.length;

            if (inputLength === 0 || inputLength > this._maxInputLength || this._data.length >= this._maxQueueItems) {
                if (inputLength === 0) {
                    this._subElements.errorMessage.innerHTML = "The input must not be empty.";
                } else if (inputLength > this._maxInputLength) {
                    this._subElements.errorMessage.innerHTML = `Input must have less than ${this._maxInputLength + 1} chars.`;
                } else {
                    this._subElements.errorMessage.innerHTML = `Queue limit of ${this._maxQueueItems} items has been reached.`;
                }
                this._subElements.queueDataInput.classList.add("invalid");

                return;
            }

            this.enqueue(this._subElements.queueDataInput.value);
            this._subElements.queueDataInput.value = "";
            localStorage.setItem("queueVisualizerData", JSON.stringify(this._data));
        });

        this._subElements.dequeueButton.addEventListener("click", () => {
            this._subElements.queueDataInput.classList.remove("invalid");
            this._subElements.errorMessage.innerHTML = "";

            this.dequeue();

            localStorage.setItem("queueVisualizerData", JSON.stringify(this._data));
        });

        this._subElements.queueDataInput.addEventListener("focus", () => {
            this._subElements.queueDataInput.classList.remove("invalid");
            this._subElements.errorMessage.innerHTML = "";
        });

        document.addEventListener("DOMContentLoaded", () => {
            const data = JSON.parse(localStorage.getItem("queueVisualizerData"));

            for (const item of data) {
                this.enqueue(item);
            }
        });
    }

    getQueueItem(text) {
        const item = document.createElement("div");

        item.classList.add("queue-item", "is-being-added");
        item.innerHTML = '<span class="item-text"></span>';
        item.firstElementChild.append(text);

        return item;
    }

    enqueue(text) {
        const item = this.getQueueItem(text);

        this._data.push(text);
        this._subElements.queueContainer.append(item);

        setTimeout(() => { item.classList.remove("is-being-added") }, 2000);
    }

    dequeue() {
        if (this._data.length > 0) {
            const items = this._subElements.queueContainer.querySelectorAll('.queue-item:not(.is-being-removed)');

            if (!items) {
                return;
            }

            items[0].classList.add("is-being-removed");
            this._data.shift();

            setTimeout(() => items[0].remove(), 2000);
        }
    }

    remove() {
        this._element.remove();
    }

    destroy() {
        this._subElements = null;
        this._data = null;
        this._element = null;
        this.remove();
    }
}
