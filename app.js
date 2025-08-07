const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const cardWrapper = document.getElementById('card-wrapper');
const h1 = document.querySelector('h1');
const hangingCat = document.getElementById('hanging-cat');
const peekingCat = document.getElementById('peeking-cat');

let catImages = [
  'https://cataas.com/cat/says/hello?width=360&height=640&fit=cover&timestamp=' + Date.now(),
  'https://cataas.com/cat/says/meow?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 1),
  'https://cataas.com/cat?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 2),
  'https://cataas.com/cat/cute?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 3),
  'https://cataas.com/cat/says/hi?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 4),
  'https://cataas.com/cat/says/kitten?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 5),
  'https://cataas.com/cat/says/love?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 6),
  'https://cataas.com/cat/says/yes?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 7),
  'https://cataas.com/cat/says/no?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 8),
  'https://cataas.com/cat/says/purr?width=360&height=640&fit=cover&timestamp=' + (Date.now() + 9)
];

let likedCats = [];
let dislikedCats = [];
let currentIndex = 0;

function displayCat() {
  cardContainer.innerHTML = '';

  if (currentIndex >= catImages.length) {
    showSummary();
    return;
  }

  const maxStack = 4;
  const stack = catImages.slice(currentIndex, currentIndex + maxStack);

  stack.forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `<img src="${src}" alt="cat" crossorigin="anonymous">`;

    // Drastic visual effect
    const scale = 1 - i * 0.1;          // Bigger scale gap
    const translateY = i * 35;          // Higher Y offset
    const rotate = i * 5;               // More rotation

    card.style.transform = `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`;
    card.style.zIndex = maxStack - i;
    card.style.opacity = i === maxStack - 1 ? 0 : 1;

    if (i === 0) {
      // Only top card is swipeable
      let startX;

      card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      });

      const glowLeft = document.getElementById('glow-left');
      const glowRight = document.getElementById('glow-right');

      card.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX > 50) {
          likedCats.push(catImages[currentIndex]);
          card.style.transform = 'translateX(100%) rotate(20deg)';
          glowRight.style.opacity = 1;
          setTimeout(() => glowRight.style.opacity = 0, 400);
        } else if (diffX < -50) {
          dislikedCats.push(catImages[currentIndex]);
          card.style.transform = 'translateX(-100%) rotate(-20deg)';
          glowLeft.style.opacity = 1;
          setTimeout(() => glowLeft.style.opacity = 0, 400);
        } else {
          return;
        }

        currentIndex++;
        setTimeout(() => {
          displayCat();
        }, 300);
      });
    }

    cardContainer.appendChild(card);
  });
}

function showSummary() {
  h1.classList.add('hidden');
  cardContainer.classList.add('hidden');
  cardWrapper.classList.add('hidden');
  hangingCat.classList.add('hidden');
  summary.classList.remove('hidden');
  peekingCat.classList.remove('hidden');
  peekingCat.classList.add('show');
  summary.innerHTML = `<h2>You liked ${likedCats.length} cat(s) 😻</h2>`;

  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  row.style.justifyContent = 'center';

  likedCats.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = '20vw';
    img.style.maxWidth = '100px';
    img.style.margin = '1vh 1vw';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
    img.style.cursor = 'pointer';

    // Add click preview functionality
    img.addEventListener('click', () => {
      previewImage(src);
    });

    row.appendChild(img);
  });

  summary.appendChild(row);

const restartBtn = document.createElement('button');
restartBtn.textContent = 'Restart';
restartBtn.style.marginTop = '20px';
restartBtn.style.padding = '10px 20px';
restartBtn.style.fontSize = '1rem';
restartBtn.style.borderRadius = '10px';
restartBtn.style.border = 'none';
restartBtn.style.backgroundColor = '#ce0217';
restartBtn.style.color = 'white';
restartBtn.style.cursor = 'pointer';
restartBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

restartBtn.addEventListener('click', () => {
  location.reload(); // Refreshes the entire page
});

summary.appendChild(restartBtn);

}

function previewImage(src) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  modalImg.src = src;
  modal.classList.remove('hidden');
}

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('image-modal').classList.add('hidden');
});

document.getElementById('image-modal').addEventListener('click', (e) => {
  if (e.target.id === 'image-modal') {
    document.getElementById('image-modal').classList.add('hidden');
  }
});


displayCat();
