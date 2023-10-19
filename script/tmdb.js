// DOMContentLoaded: HTML 문서의 모든 내용들이 로드 될 때 실행
document.addEventListener("DOMContentLoaded", function () {
  // API 요청 옵션
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjNlYzg9YmFlNjczMWNhYTY3MTExNTEyMDEyM2Q1YSIsInN1YiI6IjY1M2Q1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NXu68FaHoYaxfe5nqouc7xqztIXKivYOKsBY8W-dqn8",
    },
  };

  // 변수 초기화
  let movieData = []; // API 검색 결과 저장
  let total_pages = 0; // 최대 페이지 저장
  let currentPage = 1; // 현재 페이지 추적
  let isLoading = false; // API 요청 여부 확인
  let scrollTimeout = null; // 스크롤 이벤트 타임아웃
  let setLanguage = localStorage.getItem("language") || "ko-KR";

  // 언어 변경 함수
  function switchLanguage(ISO) {
    localStorage.setItem("language", ISO);
    location.reload();
  }

  // 언어 선택 버튼 요소 찾기
  const koreanFlagButton = document.getElementById("korean-flag");
  const englishFlagButton = document.getElementById("english-flag");

  // 언어 선택 버튼 이벤트 리스너 추가
  koreanFlagButton.addEventListener("click", function () {
    switchLanguage("ko-KR");
  });

  englishFlagButton.addEventListener("click", function () {
    switchLanguage("en-US");
  });

  // 카드 컨테이너 요소 찾기
  const cardContainer = document.getElementById("card");

  // 영화 데이터를 가져오는 함수
  function fetchMovies(page) {
    isLoading = true;

    // API에서 영화 데이터 가져오기
    fetch(`https://api.themoviedb.org/3/tv/top_rated?language=${setLanguage}&page=${page}`, options)
      .then((response) => response.json())
      .then((response) => {
        const filteredResults = response.results.filter((item) => item.overview && item.overview.trim() !== "");
        movieData = movieData.concat(filteredResults);
        total_pages = response.total_pages;
        isLoading = false;
        filterMovies();
      })
      .catch((err) => console.error(err));
  }

  // 페이지 로드 시 초기 데이터를 가져오기 위해 함수 호출
  fetchMovies(currentPage);

  // 검색어 입력 상자 요소 찾기
  const searchInput = document.getElementById("search-input");

  // 검색어 입력 상자 입력 이벤트 리스너 추가
  searchInput.addEventListener("input", filterMovies);

  // 페이지를 스크롤할 때 다음 페이지의 데이터 가져오기
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

  // 검색어를 기반으로 영화 데이터 필터링하여 출력
  function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    cardContainer.innerHTML = "";

    movieData.forEach((item) => {
      if (item.name.toLowerCase().includes(searchTerm)) {
        const image = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
        const card = document.createElement("div");
        card.classList = "col";
        const truncatedOverview = truncateText(item.overview, 35);
        card.innerHTML = /*html*/ `
          <div class="card">
            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text overview">${truncatedOverview}</p>
              <p class="card-text card-number">Rating ${item.vote_average}</p>
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

  // 텍스트가 최대 길이를 초과할 시 더 보기 링크 표시
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + `<span class="read-more">... (더 보기)</span>`;
    }
    return text;
  }
});
