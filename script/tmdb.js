//DOMContentLoaded: HTML 문서의 모든 내용들이 로드 될 때 실행
document.addEventListener("DOMContentLoaded", function () {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjNlYzg5YmFlNjczMWNhYTY3MTExNTEyMDEyM2Q1YSIsInN1YiI6IjY1MmY0MGFmY2FlZjJkMDBmZjUzZjYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NXu68FaHoYaxfe5nqouc7xqztIXKivYOKsBY8W-dqn8",
    },
  };

  let movieData = []; // API 검색 결과 저장
  let total_pages = 0; // 최대 페이지 저장
  let currentPage = 1; // 현재 페이지 추적
  let isLoading = false; // API 요청여부 확인
  let scrollTimeout = null; // 스크롤 이벤트 타임아웃

  const cardContainer = document.getElementById("card"); // HTML 문서에서 ID가 card인 요소를 찾아서 할당

  // 영화 데이터를 가져오는 함수
  function fetchMovies(page) {
    isLoading = true;
    fetch(`https://api.themoviedb.org/3/tv/top_rated?language=ko-KR&page=${page}`, options)
      .then((response) => response.json()) // API options CORS 설정 등
      .then((response) => {
        // console.log(response);
        // concat: 하나의 배열로 배열 합치기
        movieData = movieData.concat(response.results); // API 검색 결과 저장
        total_pages = response.total_pages; // 최대 페이지 저장
        isLoading = false;
        filterMovies();
      })
      .catch((err) => console.error(err));
  }
  // 페이지 로드 시 초기 데이터를 가져오기 위해 함수 호출
  fetchMovies(currentPage);

  // 검색어를 기반으로 영화 데이터를 필터링하고 출력
  function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    // console.log(searchTerm);
    cardContainer.innerHTML = "";

    movieData.forEach((item) => {
      // includes: 부분 문자열 검사
      if (item.name.toLowerCase().includes(searchTerm)) {
        const image = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
        const card = document.createElement("div"); // div 요소 생성
        card.classList = "col"; // 생성된 요소에 col 클래스 추가
        const truncatedOverview = truncateText(item.overview, 35);

        card.innerHTML = `
                  <div class="card h-100">
                      <img src="${image}" class="card-img-top" alt="...">
                      <div class="card-body">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text overview">${truncatedOverview}</p>
                          <p class="card-text card-number">평점 ${item.vote_average}</p>
                      </div>
                  </div>`;

        const overviewEl = card.querySelector(".overview"); // card 요소 내에서 클래스가 overview인 요소를 탐색

        // 마우스 호버 이벤트 바깥 -> 안
        overviewEl.addEventListener("mouseenter", () => {
          overviewEl.innerHTML = item.overview;
        });

        // 마우스 호버 이벤트 안 -> 바깥
        overviewEl.addEventListener("mouseleave", () => {
          overviewEl.innerHTML = truncatedOverview;
        });

        card.addEventListener("click", function () {
          alert(`영화 ID: ${item.id}`);
        });
        // 새로운 card 요소를 cardContainer에 추가하여 웹 페이지에 영화 카드를 동적으로 출력
        cardContainer.appendChild(card);
      }
    });
  }
  // 페이지를 스크롤 할 때, 스크롤이 페이지 하단에 도달할 때 다음 페이지의 데이터를 가져옴
  window.addEventListener("scroll", function () {
    // API 요청 중복 방지
    // 스크롤 이벤트 핸들러의 이벤트가 발생했을때 데이터를 받는 중이라면 즉시 함수 종료
    if (isLoading) {
      return;
    }

    if (scrollTimeout === null) {
      // 1초 후에 실행되는 콜백 함수
      scrollTimeout = setTimeout(function () {
        // window.innerHeight: 브라우저 높이
        // window.scrollY 스크롤 높이
        // document.body.offsetHeight: 페이지 전체 내용 높이
        if (currentPage < total_pages && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          currentPage++;
          fetchMovies(currentPage);
        }
        scrollTimeout = null;
      }, 1000);
    }
  });

  // 텍스트가 최대 길이를 초과할 시 더 보기 링크 표시
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + `<span class="read-more">... (더 보기)</span>`;
    }
    return text;
  }

  const searchInput = document.getElementById("search-input"); // HTML 문서에서 ID가 search-input인 요소를 찾아서 할당
  searchInput.addEventListener("input", filterMovies); // 검색 상자에 텍스트를 입력할 때 마다 함수를 호출해서 검색 결과 업데이트
});
