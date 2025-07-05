const collectionKey = "mhCollection";
let currentCharacter = null;

// Tema
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  if (location.pathname.includes("collection")) {
    updateCollectionView();
  }
});

// Storage
function loadCollection() {
  const saved = localStorage.getItem(collectionKey);
  return saved ? JSON.parse(saved) : [];
}

function saveCollection(collection) {
  localStorage.setItem(collectionKey, JSON.stringify(collection));
}

function saveToCollection(character) {
  const collection = loadCollection();
  const exists = collection.some(c => c.id === character.id);
  if (!exists) {
    collection.push({
      id: character.id,
      name: character.name,
      image: character.image,
      stats: character.stats,
      favorite: false,
    });
    saveCollection(collection);
  }
}

// Personaje random sin repetir
function getRandomCharacter() {
  const collection = loadCollection();
  const seenIds = collection.map(c => c.id);

  const available = characters.filter(c => !seenIds.includes(c.id));
  if (available.length === 0) {
    alert("¡Ya tienes todos los personajes!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const character = available[randomIndex];
  currentCharacter = character;

  // Mostrar
  document.getElementById("character-image").src = character.image;
  document.getElementById("character-name").textContent = character.name;
  renderStats(character.stats);

  document.getElementById("favorite-btn").disabled = false;

  saveToCollection(character);

  updateFavoriteButton();
}

function renderStats(stats) {
  const container = document.getElementById("character-stats");
  container.innerHTML = "";

  for (const key in stats) {
    const statDiv = document.createElement("div");
    statDiv.className = "stat stat-" + key.toLowerCase();
    statDiv.textContent = `${capitalize(key)}: ${stats[key]}`;
    container.appendChild(statDiv);
  }
}

// Favoritos
function updateFavoriteButton() {
  const collection = loadCollection();
  const found = collection.find(c => c.id === currentCharacter.id);
  const btn = document.getElementById("favorite-btn");
  btn.textContent = found?.favorite ? "💖 Quitar de Favoritos" : "🤍 Marcar como Favorito";
}

function toggleFavorite() {
  const collection = loadCollection();
  const index = collection.findIndex(c => c.id === currentCharacter.id);
  if (index !== -1) {
    collection[index].favorite = !collection[index].favorite;
    saveCollection(collection);
    updateFavoriteButton();
  }
}

// Colección
function updateCollectionView() {
  const grid = document.getElementById("collection-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const collection = loadCollection();

  collection.forEach(character => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${character.image}" alt="${character.name}">
      <div class="card-name">${character.name}</div>
      <div class="card-stats">
        Popularidad: ${character.stats.popularidad}<br/>
        Estilo: ${character.stats.estilo}<br/>
        Valentía: ${character.stats.valentia}
      </div>
      <button class="favorite-btn" onclick="toggleFavoriteInCollection(${character.id})">
        ${character.favorite ? "💖" : "🤍"}
      </button>
    `;
    grid.appendChild(card);
  });
}

function toggleFavoriteInCollection(id) {
  const collection = loadCollection();
  const index = collection.findIndex(c => c.id === id);
  if (index !== -1) {
    collection[index].favorite = !collection[index].favorite;
    saveCollection(collection);
    updateCollectionView();
  }
}

function clearCollection() {
  if (confirm("¿Borrar toda tu colección?")) {
    localStorage.removeItem(collectionKey);
    updateCollectionView();
  }
}

function capitalize(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
}
