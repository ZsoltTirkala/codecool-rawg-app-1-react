import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Platforms from "../UI/platform-icons/Platforms";
import { Divider } from "@material-ui/core";
import { GamesContext } from "../contexts/GamesContext";
import { useStyles } from "../../Styles";
import GamesLikeThis from "./GamesLikeThis";

const GameDetails = () => {
  const classes = useStyles();
  const [
    data,
    games,
    filters,
    setFilters,
    isLoading,
    setGames,
    isError,
    setPathSuffix,
  ] = useContext(GamesContext);

  const [game, setGame] = useState([]);
  const [tags, setTags] = useState([]);
  const [genres, setGenres] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  let id = window.location.href.split("/").reverse()[0];
  const setTagPage = (tag) => {
    setGames([]);
    setFilters({ tags: tag.toLowerCase().split(" ").join("-"), page: 1 });
  };
  useEffect(() => {
    const fetchData = async () => {
      const request = await axios(`https://api.rawg.io/api/games/${id}`);
      const similarGamesRequest = await axios(
        `https://api.rawg.io/api/games/${id}/suggested?page_size=16`
      );
      console.log(similarGamesRequest.data.results);
      setSimilarGames(similarGamesRequest.data.results);
      setGame(request.data);
      console.log(request.data);
      setPathSuffix("/games?");
      setTags(request.data.tags);
      setGenres(request.data.genres);
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <div className={"flex-container"}>
        <div
          style={{
            padding: "1rem",
            borderRadius: "1rem",
          }}
        >
          <div className="detailContainer">
            <div className="gameBackground">
              <img
                src={game.background_image}
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="game-info">
              {" "}
              <h1>{game.name}</h1>
              <div>
                <span>Release date: {game.released}</span>
              </div>
              <Platforms platforms={game.platforms} />
              <div>
                <span>Genre(s): </span>
                {genres.map((genres, index) => (
                  <span key={index}>#{genres.name} </span>
                ))}
              </div>
            </div>
            <div className="about-game">
              <h3>About</h3>
              <div
                className={"discription"}
                dangerouslySetInnerHTML={{
                  __html: game.description,
                }}
              ></div>
            </div>
            <Divider />
            {game.clip ? (
              <div className={"divider"}>
                <video
                  onClick={(e) => e.target.pause()}
                  muted
                  type="video/mp4"
                  width="100%"
                  height="100%"
                  controls="true"
                >
                  <source src={game.clip.clips.full} type="video/mp4"></source>
                  <source src="Video.ogg" type="video/ogg"></source>
                </video>
              </div>
            ) : null}

            <div className="tagsInDetails">
              <h3>Tags</h3>
              <br />
              {tags.map((tag, index) => (
                <span key={index} className="oneTag">
                  {" "}
                  <Link className="normalize-link-tags" to={`/tag/${tag.name}`}>
                    #{tag.name}{" "}
                  </Link>
                </span>
              ))}
            </div>
          </div>
          <Divider />
        </div>
      </div>
      <h1>Visually similar games:</h1>
      <div>
        <GamesLikeThis games={similarGames} />
      </div>
    </div>
  );
};

export default GameDetails;
