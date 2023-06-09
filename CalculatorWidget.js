(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <style>
           
        .image-container {
        width: 100%;
        height: 100px;
    // background:url('https://github.com/kantzd/SACcalculator/blob/main/AP%20Logo2.png?raw=true') no-repeat center center;
    background-size: cover;
    }
            .calculator {
                display: flex;
                flex-direction: column;
                width: 200px;
                background-color: #f0f0f0;
                border-radius: 4px;
                padding: 10px;
            }

            .display {
                margin-bottom: 10px;
                background-color: #fff;
                height: 30px;
                border: none;
                padding: 5px;
                text-align: right;
                border-radius: 4px;
            }
            .follow-link {
        font-size: 10px;
               }
            .buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-gap: 5px;
            }

            .buttons > button {
                height: 30px;
                border: none;
                color: #fff;
                border-radius: 4px;
            }

            .buttons > button:active {
                transform: scale(0.95);
            }
    .buttons > button.reset {
        background-color: red;
    }

            .buttons > button:not(.special-color):nth-child(4n+1),
            .buttons > button:not(.special-color):nth-child(4n+4) {
                background-color: orange;
            }

            .buttons > button:not(.special-color):nth-child(4n+2),
            .buttons > button:not(.special-color):nth-child(4n+3) {
                background-color: #5F6A9D;
            }

            .buttons > button:nth-child(5) {
                background-color: red;
            }

            .buttons > button:last-child {
                background-color: green;
                grid-column: span 2;
            }
        </style>
        <div class="calculator">
    <div class="image-container"></div> 
    <input type="text" class="display" disabled>

            <div class="buttons">
        <button>%</button>
        <button class="reset">C</button>
        <button><</button>
        <button>/</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button>*</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>-</button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>+</button>
        <button>0</button>
        <button>.</button>
        <button class="double-width special-color">=</button>

       
            </div>
    <a href="https://www.linkedin.com/company/analysisprime/" target="_blank" class="follow-link">Follow us on Linkedin - Analysis Prime</a>
        </div>
    `;

   
   
 
    class Calculator extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

        this._display = this._shadowRoot.querySelector('.display');
        this._buttons = Array.from(this._shadowRoot.querySelectorAll('button'));
        this._operation = '';
        this._newOperation = true;
    }

    connectedCallback() {
        this._buttons.forEach(button => {
            button.addEventListener('click', this._onButtonClick.bind(this));
        });
    }

    _onButtonClick(event) {
        const value = event.target.textContent;

        if (this._newOperation && ['+', '-', '*', '/'].includes(value)) {
            this._operation = this._display.value + ' ' + value + ' ';
            this._newOperation = false;
        } else {
            switch(value) {
                case '+':
                case '-':
                case '*':
                case '/':
                    this._operation += ` ${value} `;
                    break;
                case '=':
                    try {
                        this._display.value = eval(this._operation.replace(/\s/g, ''));
                        this._operation = '';
                        this._newOperation = true;
                    } catch(e) {
                        console.error(e);
                        this._display.value = 'Error';
                        this._operation = '';
                        this._newOperation = true;
                    }
                    break;
                case '%':
                try {
                    this._operation = (parseFloat(this._operation) / 100).toString();
                    this._display.value = this._operation;
                } catch(e) {
                    console.error(e);
                    this._display.value = 'Error';
                    this._operation = '';
                    this._newOperation = true;
                }
                     break;
                case 'C':
                    this._operation = '';
                    break;
                case '<':
                    this._operation = this._operation.slice(0, -1);
                    break;
                case '%':
                    let lastNumber = this._operation.split(' ').pop();
                    this._operation = this._operation.replace(new RegExp(lastNumber + '$'), lastNumber + '/100');
                    break;
                default:
                    this._operation += value;
            }
        }

        if (value !== '=') {
            this._display.value = this._operation;
        }
    }
}

customElements.define('calculator-widget', Calculator);
})();