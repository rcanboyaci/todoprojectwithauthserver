import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";
import Swal from "sweetalert2";

function DetailList(
  id,
  listname,
  setShowListDetails,
  setListId,
  setShowListname,
  setTitle
) {
  setShowListDetails((prevId) => (prevId === id ? false : id));
  setListId(id);
  setShowListname(listname);
  fetchWithHeaders(
    `${config.apiUrl}MovieToDoList/GetByListIdWithMovie/${id}`,
    "GET"
  ).then((resp) => {
    if (resp.data === null) {
      Swal.fire(`${resp.errors}`);
    }
    setTitle(resp.data);
  });
}

export default DetailList;
