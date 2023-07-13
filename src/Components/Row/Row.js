import React, { useState, useEffect } from "react";
import "./Row.css";
import axios from "../axios";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  // የማዳምጫ Or lisner Function

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request);
      setMovies(request.data.results);
      // console.log(request.data.results);
      return request;
    }

    fetchData();
  }, [fetchUrl]);

  const opts = {
    heighr: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  // ቪዲዮ ማስተካከያ  heighr,width

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie.original_name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          // Modern browsers provide the URL.SearchParams property to make it easy to
          // parse out the parameters from the query String.

          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
}

export default Row;
