import { letters, wordsArray } from '../data/data.js';

let currentImgIndex = 0;
let count = 0;
let matchFound;

const body = document.body;
body.classList.add('body');

const limitingContainer = addElement('div', 'limiting-container');
const mainContainer = addElement('section', 'main-container');

const heroSection = addElement('section', 'hero-section');
const gameName = addElement('h1', 'title', null, null, 'Hangman');
heroSection.appendChild(gameName);

const gallowsPart = addElement('div', 'gallows-part');
const imgHangmanContainer = addElement('div', 'img-hangman-container');
const imgHangman = addElement(
  'img',
  'img-hangman',
  null,
  './src/assets/gallows.png',
  null,
  'gallows-image',
);

const imgThiefContainer = addElement('div', 'img-thief-container');
const imgThiefHead = addElement(
  'img',
  'img-thief head',
  null,
  './src/assets/head.png',
  null,
  'head-image',
);

const imgThiefHandR = addElement(
  'img',
  'img-thief body-part',
  null,
  './src/assets/body.png',
  null,
  'body-image',
);

const imgThiefBody = addElement(
  'img',
  'img-thief hand-l',
  null,
  './src/assets/hand1.png',
  null,
  'hand-left-image',
);

const imgThiefHandL = addElement(
  'img',
  'img-thief hand-r',
  null,
  './src/assets/hand2.png',
  null,
  'hand-right-image',
);

const imgThiefLegL = addElement(
  'img',
  'img-thief leg-l',
  null,
  './src/assets/leg1.png',
  null,
  'leg-left-image',
);

const imgThiefLegR = addElement(
  'img',
  'img-thief leg-r',
  null,
  './src/assets/leg2.png',
  null,
  'leg-right-image',
);

imgThiefContainer.append(
  imgThiefHead,
  imgThiefHandR,
  imgThiefBody,
  imgThiefHandL,
  imgThiefLegL,
  imgThiefLegR,
);

gallowsPart.append(imgHangmanContainer);
imgHangmanContainer.append(imgHangman, imgThiefContainer);

const quizPart = addElement('div', 'quiz-part');
const wordContainer = addElement('div', 'word-container');

const { secretWord, hint } = getLocalStorageData();

secretWord
  .toUpperCase()
  .split('')
  .forEach((letter) => {
    const letterContainer = addElement('div', 'letter-container', null, null, letter, null);
    wordContainer.appendChild(letterContainer);
  });

const hintContainer = addElement('p', 'hint-container', null, null, `Hint: ${hint}`);
const counterContainer = addElement(
  'p',
  'counter-container',
  null,
  null,
  `Incorrect guesses:&nbsp;<span style="color: red">${count}/6</span>`,
);
const keyboardContainer = addElement('div', 'keyboard-container');
const audioStartGame = addElement(
  'audio',
  null,
  'audio-start-game',
  './src/assets/audio-start-game.mp3',
  null,
);

const audioClick = addElement(
  'audio',
  null,
  'audio-click',
  './src/assets/single-button-press.mp3',
  null,
);

const audioWrongLetter = addElement(
  'audio',
  null,
  'audio-wrong-letter',
  './src/assets/wrongLetter.mp3',
  null,
);

const audioGameEnd = addElement('audio', null, 'game-end', './src/assets/gameEnd.mp3', null);
const audioWin = addElement('audio', null, 'win', './src/assets/win.mp3', null);

quizPart.append(
  wordContainer,
  hintContainer,
  counterContainer,
  keyboardContainer,
  audioClick,
  audioStartGame,
  audioWrongLetter,
  audioGameEnd,
  audioWin,
);

body.appendChild(limitingContainer);
limitingContainer.append(heroSection, mainContainer);
mainContainer.append(gallowsPart, quizPart);

const letterButtons = letters.map((letter) => {
  const letterButton = addElement('button', 'letter-key', null, null, letter);
  return letterButton;
});

letterButtons.forEach((button) => keyboardContainer.appendChild(button));

let wordLetters;
let clickedLetters = [];
let buttonClicked = false;

document.addEventListener('DOMContentLoaded', () => {
  startGame();
  wordLetters = document.querySelectorAll('.letter-container');
});

function startGame() {
  const allImgThief = document.querySelectorAll(
    '.head, .body-part, .hand-l, .hand-r, .leg-l, .leg-r',
  );

  const playSoundStartGame = document.getElementById('audio-start-game');
  playSoundStartGame.play();
  const playSoundClick = document.getElementById('audio-click');
  const playSoundWrongLetter = document.getElementById('audio-wrong-letter');
  const playSoundGameEnd = document.getElementById('game-end');
  const playSoundWin = document.getElementById('win');
  const allKey = document.querySelectorAll('.letter-key');
  wordLetters = document.querySelectorAll('.letter-container');

  if (allKey.length > 0) {
    allKey.forEach((key) => {
      key.addEventListener('click', (event) => {
        if (!buttonClicked && !clickedLetters.includes(event.target.innerText.toUpperCase())) {
          buttonClicked = true;
          playSoundClick.play();
          key.classList.add('active');
          matchFound = false;

          wordLetters.forEach((letter) => {
            if (event.target.innerText.toUpperCase() === letter.textContent.toUpperCase()) {
              letter.classList.add('show');
              matchFound = true;
            }
          });

          const allLettersVisible = Array.from(wordLetters).every((letter) =>
            letter.classList.contains('show'),
          );

          if (allLettersVisible) {
            setTimeout(() => {
              createModal(`<span style="color: #cf3917">You Win!</span>`, allImgThief, allKey);
            }, 500);
            playSoundWin.play();
          }

          notMatchLetter(allImgThief, playSoundWrongLetter, playSoundGameEnd, allKey);
          buttonClicked = false;
          clickedLetters.push(event.target.innerText.toUpperCase());
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      const key = event.key;
      matchFound = false;

      if (event.key === 'Alt') {
        event.preventDefault();
      }

      if (
        /^[a-zA-Z]$/.test(key) &&
        key.length === 1 &&
        !clickedLetters.includes(key.toUpperCase())
      ) {
        buttonClicked = true;
        playSoundClick.play();

        allKey.forEach((currentKey) => {
          if (key.toUpperCase() === currentKey.textContent.toUpperCase()) {
            currentKey.classList.add('active');

            wordLetters.forEach((letter) => {
              if (key.toUpperCase() === letter.textContent.toUpperCase()) {
                letter.classList.add('show');
                matchFound = true;
              }
            });

            const allLettersVisible = Array.from(wordLetters).every((letter) =>
              letter.classList.contains('show'),
            );

            if (allLettersVisible) {
              setTimeout(() => {
                createModal(`<span style="color: #cf3917">You Win!</span>`, allImgThief, allKey);
              }, 500);
              playSoundWin.play();
            }
            notMatchLetter(allImgThief, playSoundWrongLetter, playSoundGameEnd, allKey);
          }
        });

        clickedLetters.push(key.toUpperCase());
        buttonClicked = false;
      }
    });
  }
}

function notMatchLetter(allImgThief, playSoundWrongLetter, playSoundGameEnd, allKey) {
  if (!matchFound) {
    for (let i = 0; i < allImgThief.length; i++) {
      allImgThief[i].style.opacity = i === currentImgIndex ? '1' : allImgThief[i].style.opacity;
    }
    currentImgIndex++;

    if (currentImgIndex <= allImgThief.length) {
      count++;
      playSoundWrongLetter.play();
    }

    counterContainer.innerHTML = `Incorrect guesses:&nbsp;<span style="color: red">${count}/6</span>`;

    if (currentImgIndex === allImgThief.length) {
      playSoundGameEnd.play();
      setTimeout(() => {
        createModal(
          `<span style="color: #413d3d">You lost, try again!</span>`,
          allImgThief,
          allKey,
        );
        // createModal('You lost, try again!', allImgThief, allKey);
      }, 500);
    }
  }
}

function addElement(tagName, className, id, src, text, alt) {
  const element = document.createElement(tagName);

  if (className) {
    const classes = className.split(' ');
    element.classList.add(...classes);
  }

  if (id) {
    element.id = id;
  }

  if (src) {
    element.src = src;
  }

  if (text) {
    element.innerHTML = text;
  }

  if (alt) {
    element.alt = alt;
  }

  return element;
}

function createModal(text, imagesBodyParts, allKey) {
  const currentSecretWord = localStorage.getItem('secretWord');
  const overlay = addElement('div', 'overlay');
  const modal = addElement('div', 'modal');
  const gameResult = addElement('p', 'game-result', null, null, text);
  const secretWord = addElement(
    'p',
    'secret-word',
    null,
    null,
    `Your secret word:&nbsp;<span style="color: red;">${currentSecretWord.toLocaleUpperCase()}</span>`,
  );

  const playAgainButton = addElement('button', 'play-again-button', null, null, `Play Again`);
  const closeModalButton = addElement('button', 'close-modal-button', null, null, 'X');

  modal.append(gameResult, secretWord, playAgainButton, closeModalButton);
  overlay.appendChild(modal);
  body.appendChild(overlay);
  body.style.overflow = 'hidden';

  overlay.addEventListener('click', (event) => {
    if (!modal.contains(event.target) && !event.target.classList.contains('close-modal-button')) {
      resetGame(imagesBodyParts, allKey);
      closeModal(overlay, btnCloseModal, handleEscapeKey);
    }
  });

  const btnCloseModal = document.querySelector('.close-modal-button');
  btnCloseModal.addEventListener('click', () => {
    resetGame(imagesBodyParts, allKey);
    closeModal(overlay, btnCloseModal, handleEscapeKey);
  });

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && overlay.style.display !== 'none') {
      resetGame(imagesBodyParts, allKey);
      closeModal(overlay, btnCloseModal, handleEscapeKey);
    }
  };

  document.addEventListener('keydown', handleEscapeKey);

  playAgainButton.addEventListener('click', () => {
    resetGame(imagesBodyParts, allKey);
    closeModal(overlay, btnCloseModal, handleEscapeKey);
  });
}

function closeModal(overlay, btnCloseModal, handleEscapeKey) {
  body.removeChild(overlay);
  overlay.removeEventListener('click', closeModal);
  btnCloseModal.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', handleEscapeKey);
  body.style.overflow = 'auto';
}

function resetGame(imagesBodyParts, allKey) {
  imagesBodyParts.forEach((img) => {
    img.style.opacity = '0';
  });

  allKey.forEach((key) => {
    key.classList.remove('active');
  });

  wordLetters.forEach((letter) => {
    letter.classList.remove('show');
  });

  clickedLetters = [];
  count = 0;
  currentImgIndex = 0;
  counterContainer.innerHTML = `Incorrect guesses:&nbsp;<span style="color: red">${count}/6</span>`;

  const { secretWord, hint } = getLocalStorageData();

  hintContainer.innerHTML = `Hint: ${hint}`;
  wordContainer.textContent = '';

  const secretWordModal = document.querySelector('.secret-word span');
  secretWordModal.textContent = '';
  secretWordModal.textContent = secretWord;

  secretWord
    .toLocaleUpperCase()
    .split('')
    .forEach((letter) => {
      const letterContainer = addElement('div', 'letter-container', null, null, letter, null);
      wordContainer.appendChild(letterContainer);
    });

  wordLetters = document.querySelectorAll('.letter-container');
}

function getLocalStorageData() {
  let secretWord = localStorage.getItem('secretWord');
  let hint = localStorage.getItem('hint');
  let index = localStorage.getItem('index');

  if (
    index === undefined ||
    index === null ||
    isNaN(parseInt(index)) ||
    index >= wordsArray.length - 1
  ) {
    index = 0;
  } else {
    index++;
  }

  secretWord = wordsArray[index].word;
  hint = wordsArray[index].hint;

  localStorage.setItem('secretWord', secretWord);
  localStorage.setItem('hint', hint);
  localStorage.setItem('index', index);

  return { secretWord, hint, index };
}
