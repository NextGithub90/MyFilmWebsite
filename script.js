const inputButton = document.querySelector(".button");
const searchButton = document.querySelector(".search-button");
console.log(inputButton);
// Menambahkan event listener pada input untuk mendeteksi ketika tombol "Enter" ditekan
searchButton.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    inputButton.click();
  }
});
inputButton.addEventListener("click", async function () {
  try {
    const loading = document.querySelector(".loading-spinner");

    // Validasi jika input kosong
    if (!searchButton.value.trim()) {
      alert("Teks nya mana oi????");
      return;
    }

    loading.classList.remove("d-none");
    await showdata(searchButton.value);
    loading.classList.add("d-none");
  } catch (e) {
    const loading = document.querySelector(".loading-spinner");
    console.log(e);
    alert(e);
    loading.classList.add("d-none");
  }
});

// Event binding untuk tombol detail
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("button-detail")) {
    let imdbid = e.target.dataset.imdbid;
    showDetails(imdbid);
  }
});

async function showDetails(imdbid) {
  const modalBody = document.querySelector(".modal-body");
  const modalTitle = document.querySelector(".modal-title");

  // Menambahkan spinner pada modal body
  modalBody.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
  modalTitle.textContent = "Loading...";

  // Tampilkan modal segera setelah spinner diatur
  const detailsModal = new bootstrap.Modal(document.getElementById("details"));
  detailsModal.show();

  const response = await fetch("//www.omdbapi.com/?apikey=18d0aa6e&i=" + imdbid);
  const movie = await response.json();

  const details = aboutDetails(movie);
  modalBody.innerHTML = details;
  modalTitle.textContent = movie.Title;
}

async function showdata(value) {
  return fetch(`//www.omdbapi.com/?apikey=18d0aa6e&s=${value}&type=movie`)
    .then((response) => response.json())
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      let movies = response.Search;
      let cards = "";
      movies.forEach((m) => (cards += aboutCards(m)));
      let movieContainer = document.querySelector(".isi-card");
      movieContainer.innerHTML = cards;
    });
}
function aboutCards(m) {
  return `<div class="col-4 mt-3">
        <div class="card w-100 h-100">
            <img src="${m.Poster}" class="card" alt="...">
            <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <p class="card-text text-muted">${m.Year}</p>
                <a href="#" class="btn btn-outline-primary button-detail" data-bs-toggle="modal" data-imdbid="${m.imdbID}">Show</a>
            </div>
        </div>
    </div>`;
}

function aboutDetails(m) {
  return `<div class="row">
        <div class="col-5">
            <img src="${m.Poster}" class="card-img-top" alt="...">
        </div>
        <div class="col">
            <ul class="list-group">
                <li class="list-group-item"><h4>Title: ${m.Title}</h4></li>
                <li class="list-group-item"><strong>Director:</strong> ${m.Director}</li>
                <li class="list-group-item"><strong>Actors:</strong> ${m.Actors}</li>
                <li class="list-group-item"><strong>Writer:</strong> ${m.Writer}</li>
                <li class="list-group-item"><strong>Plot:</strong> ${m.Plot}</li>
            </ul>
        </div>
    </div>`;
}
