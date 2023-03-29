import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";

function WatchedMovie(setTitle, title, mtlId, setWatched) {
  setTitle(
    title.map((item) => {
      if (item.id === mtlId) {
        return {
          ...item,
          watched: !item.watched,
        };
      } else {
        return item;
      }
    })
  );
  let id = mtlId;
  let watched = true;
  let regobj = { id, watched };
  fetchWithHeaders(`${config.apiUrl}MovieToDoList/EditMovieToDoList`, "PUT", regobj).then(
    (resp) => {
      setWatched(resp);
    }
  );
}

export default WatchedMovie;
