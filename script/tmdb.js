document.addEventListener("DOMContentLoaded", function () {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjNlYzg5YmFlNjczMWNhYTY3MTExNTEyMDEyM2Q1YSIsInN1YiI6IjY1MmY0MGFmY2FlZjJkMDBmZjUzZjYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NXu68FaHoYaxfe5nqouc7xqztIXKivYOKsBY8W-dqn8",
    },
  };

  let movieData = [];
  let total_pages = 0;
  let currentPage = 1;
  let isLoading = false;
  let scrollTimeout = null;

  const cardContainer = document.getElementById("card");

  function fetchMovies(page) {
    isLoading = true;
    fetch(`https://api.themoviedb.org/3/tv/top_rated?language=ko-KR&page=${page}`, options)
      .then((response) => response.json())
      .then((response) => {
        movieData = movieData.concat(response.results);
        total_pages = response.total_pages;
        isLoading = false;
        filterMovies();
      })
      .catch((err) => console.error(err));
  }

  fetchMovies(currentPage);

  function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    cardContainer.innerHTML = "";

    movieData.forEach((item) => {
      if (item.name.toLowerCase().includes(searchTerm)) {
        const image = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
        const card = document.createElement("div");
        card.classList = "col";
        const truncatedOverview = truncateText(item.overview, 35);

        card.innerHTML = `
                  <div class="card h-100">
                      <img src="${image}" class="card-img-top" alt="...">
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text overview">${truncatedOverview}</p>
                          <p class="card-text">${item.vote_average}</p>
                      </div>
                  </div>`;

        const overviewEl = card.querySelector(".overview");

        overviewEl.addEventListener("mouseenter", () => {
          overviewEl.innerHTML = item.overview;
        });

        overviewEl.addEventListener("mouseleave", () => {
          overviewEl.innerHTML = truncatedOverview;
        });

        card.addEventListener("click", function () {
          alert(`영화 ID: ${item.id}`);
        });

        cardContainer.appendChild(card);
      }
    });
  }

  window.addEventListener("scroll", function () {
    if (isLoading) {
      return;
    }

    if (scrollTimeout === null) {
      scrollTimeout = setTimeout(function () {
        if (currentPage < total_pages && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          currentPage++;
          fetchMovies(currentPage);
        }
        scrollTimeout = null;
      }, 1000);
    }
  });

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + `<span class="read-more">... (더 보기)</span>`;
    }
    return text;
  }

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", filterMovies);
});
