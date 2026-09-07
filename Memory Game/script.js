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

//Items array
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

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
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

//Start game 
levelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const size = parseInt(btn.getAttribute("data-size"));
    const needed = (size * size) / 2;
    //Validasi jumlah foto cukup untuk level ini
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
    //controls amd buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    //Sesuaikan ukuran kartu
    wrapper.classList.remove("size-4", "size-6");
    wrapper.classList.add(`size-${size}`);
    //Start timer
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;

    //Putar audio
    gameAudio.currentTime = 0; // Kembalikan ke awal durasi
    gameAudio.play().catch((error) => {
      console.log("Autoplay dicegah oleh browser:", error);
    gameAudio.volume = 0.1;
    });

    initializer();
  });
});

//Stop game
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

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom(currentSize);
  matrixGenerator(cardValues, currentSize);
};