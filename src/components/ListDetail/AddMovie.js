import Swal from "sweetalert2";
import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";
function AddMovie(ListId, movieToDoListId, addMovieCloseModal, setTitle) {
  let todolistId = ListId;
  let movieId = movieToDoListId;
  let regobj = { todolistId, movieId };

  fetchWithHeaders(
    `${config.apiUrl}MovieToDoList/SaveMovieToDoList`,
    "POST",
    regobj
  )
    .then((resp) => {
      if (resp.data === null) {
        Swal.fire(`${resp.errors}`);
      }
    })
    .then(() => {
      fetchWithHeaders(
        `${config.apiUrl}MovieToDoList/GetByListIdWithMovie/${todolistId}`,
        "GET"
      ).then((resp) => {
        setTitle(resp.data);
      });
      addMovieCloseModal();
    });
}

export default AddMovie;
