import keys from './keys.js';

const defaultLanguage = {
  language: 'En',
  capsFlag: false,
  shiftFlag: false,
  ctrlLeft: false,
  ctrlRight: false,
  altLeft: false,
  altRight: false,
};

function getKeyText(keyName) {
  if (keys[keyName].name) { // service button
    return keys[keyName].name;
  }

  let result = keys[keyName][defaultLanguage.language] || keys[keyName].En;
  if (defaultLanguage.capsFlag && !defaultLanguage.shiftFlag) { // Заглавные буквы
    result = result.toLocaleUpperCase();
  }

  let flagString = defaultLanguage.language;
  if (defaultLanguage.shiftFlag) {
    flagString += 'Shift';
    result = keys[keyName][flagString] || keys[keyName].EnShift || result;
    if (defaultLanguage.capsFlag) {
      result = result.toLocaleLowerCase();
    } else {
      result = result.toLocaleUpperCase();
    }
  }

  return result;
}

const Keyboard = {
  keyList: [
    ['Backslash', 'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
    ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight']],
  updateKeyboard: () => {
    const keyArr = [].concat(...Keyboard.keyList);
    for (let iterator = 0; iterator < keyArr.length; iterator += 1) {
      const keyChange = keyArr[iterator];
      const domKey = document.querySelector(`#${keyChange}`);
      domKey.innerHTML = getKeyText(keyChange);
    }
  },
  keyClick: (event) => {
    if (event.target.id === 'CapsLock') {
      defaultLanguage.capsFlag = !defaultLanguage.capsFlag;
      event.target.classList.toggle('pushed');
      Keyboard.updateKeyboard();
    }
    if ((event.target.id === 'ShiftLeft' || event.target.id === 'ShiftRight')) {
      defaultLanguage.shiftFlag = !defaultLanguage.shiftFlag;
      document.querySelector('#ShiftLeft').classList.toggle('pushed'); // event.target.classList.toggle('pushed');
      document.querySelector('#ShiftRight').classList.toggle('pushed'); // event.target.classList.toggle('pushed');
      Keyboard.updateKeyboard();
      event.preventDefault();
    }
  },
  create: (node) => {
    for (let row = 0; row < Keyboard.keyList.length; row += 1) {
      const newRow = document.createElement('div');
      newRow.className = `row row${row}`;
      for (let keyI = 0; keyI < Keyboard.keyList[row].length; keyI += 1) {
        const keyButton = document.createElement('button');
        keyButton.className = 'key__button';
        keyButton.id = Keyboard.keyList[row][keyI];
        if (keys[Keyboard.keyList[row][keyI]].service) {
          if (keys[Keyboard.keyList[row][keyI]].double) {
            keyButton.className += ' key__double';
          }
          if (Keyboard.keyList[row][keyI] === 'Space') {
            keyButton.className += ' key__space';
            keyButton.innerHTML = ' ';
          } else {
            keyButton.innerHTML = keys[Keyboard.keyList[row][keyI]].name;
          }
        } else {
          keyButton.innerHTML = keys[Keyboard.keyList[row][keyI]][defaultLanguage.language];
        }
        keyButton.addEventListener('mousedown', Keyboard.keyClick);
        newRow.append(keyButton);
      }
      node.append(newRow);
    }
  },
};

export { Keyboard, defaultLanguage };