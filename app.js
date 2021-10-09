'use-strict';

const digitsContainer = document.querySelector('.digits-container');
const display = document.querySelector('.disp-content');

const clrBtn = document.querySelector('.clear');
const operands = document.querySelectorAll('.operator');
const equalBtn = document.querySelector('.eq');
const muteBtn = document.querySelector('.mute-btn');
const unmuteBtn = document.querySelector('.unmute-btn');

const beep = document.querySelector('.beep');
const equalButtonSound = document.querySelector('.ebs');
const clearButtonSound = document.querySelector('.cbs');

const allTones = document.querySelectorAll('audio');

// Data container
const data = {
  string: '',
  regex1: /[+\-*/]{1,}/,
  regex2: /[+\-*/]/,
  regex3: /[\.]{2,}/,
  result: '',
  isMuted: false,
};

function clearFields() {
  data.string = '';
  display.textContent = '';
}
// Prevent multi operator inputs
function stopDoubleOp(str) {
  return data.regex1.test(str);
}
// Prevent multi dots inputs
function stopDoubleDots(str) {
  return data.regex3.test(str);
}
// Mute/unmute functions
function muteSoundBtn() {
  data.isMuted = true;
  allTones.forEach(audio => (audio.muted = true));
  muteBtn.classList.toggle('hidden');
  unmuteBtn.classList.toggle('hidden');
}

function unmuteSoundBtn() {
  data.isMuted = false;
  allTones.forEach(audio => (audio.muted = false));
  unmuteBtn.classList.toggle('hidden');
  muteBtn.classList.toggle('hidden');
}
// Calculate result
function calc(string) {
  // Split string on operator and transform elements to numbers
  const arr = string.split(data.regex2).map(el => Number(el));
  const [firOp, secOp] = arr;
  const [operator] = string.match(data.regex2);

  const result =
    operator === '+'
      ? firOp + secOp
      : operator === '-'
      ? firOp - secOp
      : operator === '*'
      ? firOp * secOp
      : firOp / secOp;

  clearFields();
  data.result = result;
}

function renderExpression(t) {
  // t will be event.target
  // Return if click wasn't on number field
  if (!t.classList.contains('digits')) return;
  // Guard clause to prevent order of input(return if operator is before operand)
  if (!data.string && t.classList.contains('operator')) return;
  // Guard clause to prevent multiple operator inputs
  if (stopDoubleOp(data.string) && t.classList.contains('operator')) return;
  // Alert, clear fields and return if multiple dots inputs are attempted
  if (stopDoubleDots(data.string)) {
    alert('Consecutive dots input not allowed!');
    clearFields();
    return;
  }
  // Condition for playing same tone on all digits fields except '=' digit
  if (!t.classList.contains('eq')) beep.play();
  // If all conditions are met, concat new input to the string, update string, play tone and update display
  data.string += t.id;
  display.textContent = data.string;
}

function onEqualsButtonPress() {
  equalButtonSound.play();
  // Prevent multiple dot inputs on second possible place
  if (stopDoubleDots(data.string)) {
    alert('Consecutive dots input not allowed!');
    clearFields();
    return;
  }
  // Return if no operator present in the string
  if (!data.regex1.test(data.string)) {
    clearFields();
    return;
  }
  // Return if user tries to call this function without second operator (ex. 10 * '')
  if (data.string.split(data.regex2)[1] === '') {
    clearFields();
    return;
  }
  // If all is ok, calculate result and store it in data.result
  calc(data.string);
  // Because of timeout, calc is executed first, and than it is possible to read and display that data in the UI
  setTimeout(() => {
    // Read data.result value and display it in UI
    display.textContent = data.result;
  }, 0);
}

equalBtn.addEventListener('click', onEqualsButtonPress);
// Sounds mute
muteBtn.addEventListener('click', muteSoundBtn);
// Sounds unmute
unmuteBtn.addEventListener('click', unmuteSoundBtn);

digitsContainer.addEventListener('click', function (e) {
  const t = e.target;
  renderExpression(t);
});

clrBtn.addEventListener('click', () => {
  clearFields();
  clearButtonSound.play();
});

// Keyboard controls
window.addEventListener('keyup', e => {
  // Test and return if non numerical key is pressed
  const testKey = /[0-9\.+/\-*]/.test(e.key);
  if (!testKey) return;
  const t = document.getElementById(`${e.key}`); // t = Event target
  renderExpression(t);
});

window.addEventListener('keyup', e => {
  if (e.key !== 'Enter' && e.key !== '=') return;
  onEqualsButtonPress();
});

window.addEventListener('keyup', e => {
  if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Clear') return;
  clearFields();
  clearButtonSound.play();
});
// Mute on m || M
window.addEventListener('keyup', e => {
  if (e.key !== 'm' && e.key !== 'M') return;
  muteSoundBtn();
});
// Unmute on u || U
window.addEventListener('keyup', e => {
  if (e.key !== 'u' && e.key !== 'U') return;
  unmuteSoundBtn();
});
