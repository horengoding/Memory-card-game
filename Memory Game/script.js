const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const levelButtons = document.querySelectorAll(".level-btn");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const wrapper = document.querySelector(".wrapper");

const gameAudio = document.getElementById("game-audio");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let currentSize = 4;

const items = [
  { name: "Gracia", image: "Gracia.png" },
  { name: "Fiony", image: "Fiony.png" },
  { name: "Freya", image: "Freya.png" },
  { name: "Olla", image: "Olla.png" },
  { name: "Gita", image: "Gita.png" },
  { name: "Muthe", image: "Muthe.png" },
  { name: "Jessi", image: "Jessi.png" },
  { name: "Kathrin", image: "Kathrin.png" },
  { name: "Oniel", image: "Oniel.png" },
  { name: "Lana", image: "Lana.png" },
  { name: "Christy", image: "Christy.png" },
  { name: "Gracie", image: "Gracie.png" },
  { name: "Lulu", image: "Lulu.png" },
  { name: "Cynthia", image: "Cynthia.png" },
  { name: "Cathy", image: "Cathy.png" },
  { name: "Lia", image: "Lia.png" },
  { name: "Gendis", image: "Gendis.png" },
  { name: "Alya", image: "Alya.png" },
];

let seconds = 0,
  minutes = 0;
let movesCount = 0,
  winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
 
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {

    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const size = parseInt(btn.getAttribute("data-size"));
    const needed = (size * size) / 2;
    if (items.length < needed) {
      alert(
        `Level ${size}x${size} butuh minimal ${needed} foto unik, tapi baru ada ${items.length}. Tambahkan foto dulu ya.`
      );
      return;
    }
    currentSize = size;
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    wrapper.classList.remove("size-4", "size-6");
    wrapper.classList.add(`size-${size}`);
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;

    gameAudio.currentTime = 0;
    gameAudio.volume = 0.1;
    
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    
    wrapper.classList.remove("size-4", "size-6");
    wrapper.classList.add(`size-${size}`);
    
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;

    
    gameAudio.currentTime = 0;
    gameAudio.play().catch((error) => {
      console.log("Autoplay dicegah oleh browser:", error);
    });

    initializer();
  });
});


stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    clearInterval(interval);

    gameAudio.pause();
    gameAudio.currentTime = 0;
  })
);

const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(currentSize);
  matrixGenerator(cardValues, currentSize);
};
