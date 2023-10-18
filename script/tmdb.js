// 영화 정보 요약
// 텍스트의 길이가 최대 길이를 초과하면 지정된 최대 길이로 잘라내고 텍스트의 끝에 더 보기 링크 추가
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + `<span class="read-more">... (더 보기)</span>`;
  }
}

// 페이지 로드 시 수행
// DOMContentLoaded 이벤트 리스너는 페이지가 로드 될 때 실행하는 코드 블록
// HTML 문서가 모두 로드된 후 JavaScript 코드를 실행하는데 사용
document.addEventListener("DOMContentLoaded", function () {
  // API 요청을 보낼때 필요한 설정을 담고 있는 객체
  // HTTP 요청의 메서드, 헤더 및 권한정보를 설정하며 API토큰을 사용하여 요청을 인증함
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjNlYzg5YmFlNjczMWNhYTY3MTExNTEyMDEyM2Q1YSIsInN1YiI6IjY1MmY0MGFmY2FlZjJkMDBmZjUzZjYzMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NXu68FaHoYaxfe5nqouc7xqztIXKivYOKsBY8W-dqn8",
    },
  };

  // 영화 데이터를 저장하는 배열로 API 응답에서 추출된 영화 정보를 저장
  let movieData = [];
  let total_pages = 0;

  // 영화 정보 API 가져오기
  fetch("https://api.themoviedb.org/3/tv/top_rated?language=ko-KR&page=1", options)
    // options의 정보가 여기에 담겨 있는 듯
    .then((response) => response.json())
    .then((response) => {
      // 영화 데이터를 배열에 저장
      movieData = response.results;
      // 데이터 검사
      apiDataRes(movieData);
      total_pages = response.total_pages;
      // console.log(total_pages, "뭐고");
    })
    .catch((err) => console.error(err));

  const searchInput = document.getElementById("search-input");

  // 검색어 입력 시 필터링 함수 호출
  searchInput.addEventListener("input", filterMovies);

  function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const cardContainer = document.getElementById("card");
    cardContainer.innerHTML = ""; // 기존 카드를 초기화

    movieData.forEach((item) => {
      console.log(item);
      if (item.name.toLowerCase().includes(searchTerm)) {
        let image = `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
        const card = document.createElement("div");
        card.classList = "col";
        const truncatedOvervier = truncateText(item.overview, 35);

        card.innerHTML = `
        <div class="card h-100">
        <img
          src="${image}"
          class="card-img-top"
          alt="..."
        />
        <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text overview">${truncatedOvervier}</p>
        <p class="card-text">${item.vote_average}</p>
        </div>
        </div>`;

        const overviewEl = card.querySelector(".overview");

        // 마우스 호버 이벤트
        // mouseenter: 사용자가 마우스를 해당 element 바깥에서 안으로 옮겼을 때 발생
        overviewEl.addEventListener("mouseenter", () => {
          overviewEl.innerHTML = item.overview;
        });

        // 마우스 호버 이벤트
        // mouseleave: 사용자가 마우스를 해당 element 안에서 바깥으로 옮겼을 때 발생
        overviewEl.addEventListener("mouseleave", () => {
          overviewEl.innerHTML = truncatedOvervier;
        });

        // 영화 ID 출력 이벤트
        card.addEventListener("click", function () {
          alert(`영화 ID: ${item.id}`);
        });

        cardContainer.appendChild(card);
      }
    });
  }

  // 초기 데이터 필터링
  // 데이터가 존재하지 않는 경우 알림 메시지와 함께 콘솔에러 출력
  function apiDataRes(data) {
    if (data) {
      filterMovies();
    } else {
      alert("데이터를 불러올 수 없음");
      console.error("데이터 없다!!!! 어디갔냐!!!");
    }
  }
});
