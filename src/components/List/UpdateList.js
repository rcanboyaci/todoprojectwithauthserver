import Validation from "../../validations/Validation";
import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";

function UpdateList(e, listname, id, setList, updateListCloseModal) {
  e.preventDefault();
  if (Validation(listname)) {
    let regobj = { id, listname };
    fetchWithHeaders(
      `${config.apiUrl}ToDoList/EditToDoList`,
      "PUT",
      regobj
    ).then(() => {
      fetchWithHeaders(
        `${config.apiUrl}ToDoList/GetAllToDoList`,
        "GET"
      ).then((resp) => {
        setList(resp.data);
      });
    });
    updateListCloseModal();
  }
}

export default UpdateList;
