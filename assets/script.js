/*TODO: tidy code, 
tonnes of cleanup, 
reduce repeated and put into const/let, 
improve css styling, 
enable multiple movies per day, 
once opened automatically load the movie image
correct rushed and rn really poor responsiveness
improve on css grid to make a custom size large number 25 box
*/

import filmObjectData from "../modules/data.js";

const FILM_API = "https://api.themoviedb.org/3/movie/";
const FILM_API_KEY = "8f183f1fe952c43a5e9c4cdbe5b190da";

const CURRENT_DATE = new Date(); // remove value in production "November 5"

/*console.log(
  "for testing puposes the date is currently set as November 5. Change in script.js, line 16"
);*/

const populateModal = (dataWeWant) => {
  let dayModal = document.querySelector(".door-modal");
  dayModal.style.display = "block";

  //console.log(dataWeWant);

  let dataObjectData = JSON.parse(dataWeWant);

  //console.log(dataObjectData);

  dayModal.innerHTML = `
    <div>
    <div class="header"><h3>${dataObjectData["title"]}</h3><button id="close-toggle">X</button></div>
    Whooohooo get watching!!! Available on either Disney+ or Sky or Netflix or Amazon Prime
    <img src="//image.tmdb.org/t/p/w500/${dataObjectData["poster_path"]}">
    | ${dataObjectData["average"]} | ${dataObjectData["release"]} | 
      <p>${dataObjectData["overview"]}</p>
    </div>
    `;

  let closeModalBtn = dayModal.querySelector("#close-toggle");

  // Add event listener
  closeModalBtn.addEventListener("click", (event) => {
    dayModal.innerHTML = "";
    dayModal.style.display = "none";
  });
};

const fetchFilmData = function (event, filmId, filmDay) {
  console.log(event);
  console.log(filmDay);

  /*if (filmId === "multiple") {
    let groupArray = JSON.stringify(filmObjectData).indexOf("multiple") > -1;

    const filmList = groupArray.map((film) => {});

    Promise.all([
      fetch(FILM_API + filmId + "?api_key=" + FILM_API_KEY),
      fetch(FILM_API + filmId + "?api_key=" + FILM_API_KEY),
    ])
      .then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then(function (data) {
        // Log the data to the console
        // You would do something with both sets of data here
        console.log(data);
      })
      .catch(function (error) {
        // if there's an error, log it
        console.log(error);
      });
  }*/

  let xhr = new XMLHttpRequest();

  xhr.open("GET", FILM_API + filmId + "?api_key=" + FILM_API_KEY);
  xhr.responseType = "json";

  xhr.onload = function () {
    if (this.readyState === this.DONE && this.status === 200) {
      // specific response code for fetching the user
      let userData = xhr.response;
      //console.log(null, xhr.response);
      let dataWeWant = `
        {
            "title": "${userData["title"]}",
            "average": "${userData["vote_average"]}",
            "release": "${userData["release_date"]}",
            "poster_path": "${userData["poster_path"]}",
            "overview": "${userData["overview"]}"
        }
      `;

      document.cookie = `day${filmDay}=true`;
      console.log(document.cookie);

      populateModal(dataWeWant);
    } else {
      alert(
        "Couldn't load data! on " +
          FILM_API +
          filmId +
          "?api_key=" +
          FILM_API_KEY
      );
    }
  };
  xhr.send();
};

const checkACookieExists = function (name) {
  // code taken from mdn docs
  if (
    document.cookie
      .split(";")
      .some((item) => item.trim().startsWith(name + "="))
  ) {
    return true;
  }
  return false;
};

const filmList = filmObjectData.map((film) => {
  let filmItem = document.createElement("div");
  let filmDay = film.day;
  filmItem.classList.add("christmas-calendar_door", `door-${filmDay}`);
  if (checkACookieExists("day" + filmDay)) {
    filmItem.classList.add("open");
  }
  filmItem.setAttribute("data-tmdb", film.film_id);

  filmItem.innerHTML = `
      <a href="#" class="lid-toggle">
        <h2 class="film__title">Day ${filmDay}</h2>
      </a>
    `;

  let button = filmItem.querySelector(".lid-toggle");

  // Add event listener
  button.addEventListener("click", (event) => {
    if (
      (CURRENT_DATE.getMonth() === 10 && CURRENT_DATE.getDate() === filmDay) ||
      (CURRENT_DATE.getMonth() === 10 && CURRENT_DATE.getDate() >= filmDay) //should be 11 for december but lets pretend with 10 for testing
    ) {
      fetchFilmData(event, film.film_id, filmDay);
      filmItem.classList.add("open");
    } else {
      alert(`Naughty, it's not December ${filmDay} yet!`);
    }
  });

  return filmItem;
});

// Append each film item to the grid
const calendarGrid = document.querySelector(".christmas-calendar");

calendarGrid.innerHTML = "";

filmList.forEach((film) => {
  calendarGrid.append(film);
});
