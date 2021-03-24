import './styles/reset.scss';
import './styles/style.scss';
import * as math from 'mathjs';

const state = {
  expression: [],
};

const render = () => {
  document.querySelector('.display__input').value = state.expression.join('');
};

const normalizeState = () => state.expression.join('').split(/([+\-/×])/).filter((item) => item !== '');

const addNumber = (number) => {
  state.expression.push(number);
  render();
};

const addSymbol = (symbol) => {
  state.expression = normalizeState();

  if (!state.expression.length) {
    state.expression.push(0 + symbol);
    render();
  } else if (!'+-/×.'.includes(state.expression[state.expression.length - 1])) {
    if (symbol === '.' && state.expression[state.expression.length - 1].includes('.')) {
      return;
    }
    state.expression.push(symbol);
    render();
  }
};

const allClean = () => {
  state.expression = [0];
  render();
  state.expression = [];
};

const deleteLastChar = () => {
  if (state.expression.length < 2) {
    state.expression = [0];
    render();
    state.expression = [];
    return;
  }
  const indexLastChar = state.expression.length - 1;
  const result = state.expression.slice(0, indexLastChar);
  state.expression = result;
  render();
};

const calculate = () => {
  let result = '';
  state.expression.forEach((item) => {
    if ('+-/'.includes(item)) {
      result += ` ${item} `;
    } else if ('×'.includes(item)) {
      result += ' * ';
    } else {
      result += item;
    }
  });
  state.expression = [...math.evaluate(result).toString()];
  render();
};

const initialize = () => {
  document.querySelector('.numpad').addEventListener('click', (event) => {
    if (state.expression.length > 15) {
      state.expression = ['Превышено количество символов'];
      render();
      document.querySelector('.all-clean').addEventListener('click', () => allClean());
      return;
    }

    const elementClasses = event.target.classList.value;
    if (elementClasses.includes('number')) {
      addNumber(event.target.textContent);
    } else if (elementClasses.includes('symbol')) {
      addSymbol(event.target.textContent);
    } else if (elementClasses.includes('all-clean')) {
      allClean();
    } else if (elementClasses.includes('backspace')) {
      deleteLastChar();
    } else if (elementClasses.includes('result')) {
      calculate();
    }
  });
};

window.addEventListener('load', () => initialize());
