const cards = [
  {
    word: "Serendipity",
    pronunciation: "/ˌser.ənˈdɪp.ə.ti/",
    type: "noun",
    meaning: "Sự tình cờ may mắn",
    example: "Finding this little bookstore was pure serendipity.",
    exampleMeaning: "Tìm thấy hiệu sách nhỏ này là một sự tình cờ may mắn.",
  },
  {
    word: "Resilient",
    pronunciation: "/rɪˈzɪl.jənt/",
    type: "adjective",
    meaning: "Kiên cường, có khả năng phục hồi",
    example: "Children are often more resilient than we expect.",
    exampleMeaning: "Trẻ em thường kiên cường hơn chúng ta nghĩ.",
  },
  {
    word: "Curious",
    pronunciation: "/ˈkjʊr.i.əs/",
    type: "adjective",
    meaning: "Tò mò, ham tìm hiểu",
    example: "Stay curious and keep asking questions.",
    exampleMeaning: "Hãy luôn tò mò và tiếp tục đặt câu hỏi.",
  },
  {
    word: "Accomplish",
    pronunciation: "/əˈkʌm.plɪʃ/",
    type: "verb",
    meaning: "Hoàn thành, đạt được",
    example: "Small steps help you accomplish big goals.",
    exampleMeaning: "Những bước nhỏ giúp bạn đạt được mục tiêu lớn.",
  },
  {
    word: "Grateful",
    pronunciation: "/ˈɡreɪt.fəl/",
    type: "adjective",
    meaning: "Biết ơn, cảm kích",
    example: "I am grateful for your thoughtful support.",
    exampleMeaning: "Tôi biết ơn sự hỗ trợ chu đáo của bạn.",
  },
];

let cardIndex = 0;
let isFlipped = false;
let learned = 7;

const flashcard = document.querySelector("#flashcard");
const soundButton = document.querySelector(".sound-button");
const feedback = document.querySelector(".feedback");
const cardCount = document.querySelector(".card-count");
const frontType = document.querySelector(".card-front .word-type");
const backType = document.querySelector(".card-back .word-type");
const frontWord = document.querySelector(".card-front h3");
const pronunciation = document.querySelector(".pronunciation");
const backMeaning = document.querySelector(".card-back h3");
const example = document.querySelector(".example-box p");
const exampleMeaning = document.querySelector(".example-box span");
const progressText = document.querySelector(".progress-copy strong");
const progressTrack = document.querySelector(".progress-track");
const progressBar = progressTrack.querySelector("span");

function renderCard() {
  const card = cards[cardIndex];

  cardCount.textContent = `${cardIndex + 1} / ${cards.length}`;
  frontType.textContent = card.type;
  backType.textContent = card.type;
  frontWord.textContent = card.word;
  pronunciation.textContent = card.pronunciation;
  backMeaning.textContent = card.meaning;
  example.textContent = `“${card.example}”`;
  exampleMeaning.textContent = card.exampleMeaning;

  soundButton.setAttribute(
    "aria-label",
    `Nghe phát âm từ ${card.word}`,
  );

  flashcard.classList.toggle("is-flipped", isFlipped);
}

function flipCard() {
  isFlipped = !isFlipped;
  flashcard.classList.toggle("is-flipped", isFlipped);
}

function updateProgress() {
  progressText.textContent = `${learned}/10 từ`;
  progressTrack.setAttribute(
    "aria-label",
    `${learned} trên 10 từ`,
  );
  progressBar.style.width = `${(learned / 10) * 100}%`;
}

function moveCard(direction, knew) {
  let message = "";

  if (typeof knew === "boolean" && learned < 10) {
    learned = Math.min(10, learned + 1);

    message = knew
      ? "Tuyệt vời! Tiếp tục phát huy nhé."
      : "Đã thêm vào danh sách ôn tập.";
  }

  feedback.textContent = message || "Sẵn sàng";
  feedback.classList.toggle("visible", Boolean(message));

  updateProgress();

  isFlipped = false;
  cardIndex = (cardIndex + direction + cards.length) % cards.length;

  renderCard();
}

flashcard.addEventListener("click", flipCard);

flashcard.addEventListener("keydown", (event) => {
  if (
    event.target === flashcard &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    flipCard();
  }
});

soundButton.addEventListener("click", (event) => {
  event.stopPropagation();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      cards[cardIndex].word,
    );

    utterance.lang = "en-US";
    utterance.rate = 0.8;

    window.speechSynthesis.speak(utterance);
  }
});

document
  .querySelector('[aria-label="Từ trước"]')
  .addEventListener("click", () => moveCard(-1));

document
  .querySelector('[aria-label="Từ tiếp theo"]')
  .addEventListener("click", () => moveCard(1));

document
  .querySelector(".answer-button.review")
  .addEventListener("click", () => moveCard(1, false));

document
  .querySelector(".answer-button.know")
  .addEventListener("click", () => moveCard(1, true));

renderCard();