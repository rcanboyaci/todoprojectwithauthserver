import { toast } from "react-toastify";

function Validation(listname) {
  let isproceed = true;
  let errormessage = "Please enter the value in ";
  if (listname === null || listname === "") {
    isproceed = false;
    errormessage += " Listname";
  }
  if (!isproceed) {
    toast.warning(errormessage);
  }
  return isproceed;
}

export default Validation;
