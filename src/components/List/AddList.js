import Validation from "../../validations/Validation";
import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";

function AddList(e, listname, list, setList, addListCloseModal) {
  e.preventDefault();
  if (Validation(listname)) {
    fetchWithHeaders(`${config.apiUrl}ToDoList/SaveToDoList`, "POST", {
      listname,
    }).then((resp) => {
      if (list === null) {
        setList([resp.data]);
        addListCloseModal();
      } else {
        setList([...list, resp.data]);
        addListCloseModal();
      }
    });
  }
}

export default AddList;
