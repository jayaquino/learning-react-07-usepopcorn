import { useState, useEffect } from "react";

const KEY = "ed36939b";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();

          if (data.Response === "False" && data.Search)
            throw new Error("Movie not found");
          console.log("data", data.Response);
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          setMovies(data.Search || []);
          setError("");
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length < 3) {
        setMovies([]);
        setError("");
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
