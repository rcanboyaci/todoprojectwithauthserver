import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ListDetail from "./ListDetail";
import { fetchWithHeaders } from "../helpers/fetchHelpers";
import config from "../config";

function List() {
  const usenavigate = useNavigate();
  const [addListModal, setAddListModal] = useState(false);
  const addListCloseModal = () => setAddListModal(false);
  const addListOpenModal = () => setAddListModal(true);
  const [updateListModal, setUpdateListModal] = useState(false);
  const updateListCloseModal = () => setUpdateListModal(false);
  const updateListOpenModal = () => setUpdateListModal(true);
  const [listname, setListname] = useState("");
  const [list, setList] = useState([]);
  const [id, setListId] = useState(null);
  const [title, setTitle] = useState("");
  const [showListname, setShowListname] = useState("");
  const [showListDetails, setShowListDetails] = useState({}, false);

  useEffect(() => {
    let email = sessionStorage.getItem("email"); //Liste yoksa çekmemem lazım.
    if (email === "" || email === null) {
      usenavigate("/login");
    } else {
      fetchWithHeaders(`${config.todoListUrl}/GetAllToDoList`, "GET").then(
        (resp) => {
          console.log(resp.data);
          if (resp.lengt > 0) {
            setList(resp.data);
          }
        }
      );
    }
  }, [usenavigate]);

  function ListValidate() {
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

  function addList(e) {
    e.preventDefault();
    if (ListValidate()) {
      fetchWithHeaders(`${config.todoListUrl}/SaveToDoList`, "POST", {
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

  const editButton = (id) => {
    updateListOpenModal(true);
    setListId(id);
  };

  function updateList(e) {
    e.preventDefault();
    if (ListValidate()) {
      let regobj = { id, listname };
      fetchWithHeaders(
        `${config.todoListUrl}/EditToDoList`,
        "PUT",
        regobj
      ).then(() => {
        fetchWithHeaders(`${config.todoListUrl}/GetAllToDoList`, "GET").then(
          (resp) => {
            setList(resp.data);
          }
        );
      });
      updateListCloseModal();
    }
  }

  function deleteList(id) {
    setListId(id);
    fetchWithHeaders(
      `${config.todoListUrl}/RemoveToDoList/${id}`,
      "DELETE"
    ).then(() => {
      setList(list.filter((item) => item.id !== id));
      if (showListDetails === id) {
        setShowListDetails(null);
      }
    });
  }

  function detailList(id, listname) {
    setShowListDetails((prevId) => (prevId === id ? null : id));
    setListId(id);
    setShowListname(listname);
    console.log(title.indexOf());
    if (title.indexOf !== -1) {
      fetchWithHeaders(
        `${config.movieToDoListUrl}/GetByListIdWithMovie/${id}`,
        "GET"
      ).then((resp) => {
        if (resp.data === null) {
          toast.info(`${resp.errors}`);
        }
        setTitle(resp.data);
      });
    } else {
      setTitle([...title]);
    }
  }

  return (
    <div className="body">
      <div className="row">
        <div className="col-4">
          <div>
            <strong>My List</strong>
          </div>
          {list &&
            list
              .sort((a, b) => a.id - b.id)
              .map((item) => (
                <ul className="list-group" key={item.id} data={item}>
                  <li className="list-group-item" style={{ marginTop: "15px" }}>
                    <strong>{item.listName}</strong>
                    <button
                      type="button"
                      style={{ float: "right" }}
                      onClick={() => detailList(item.id, item.listName)}
                      className="btn btn-outline-dark btn-sm"
                    >
                      ☰
                    </button>
                    <Button
                      style={{ float: "right" }}
                      onClick={() => editButton(item.id)}
                      variant="secondary btn-sm"
                    >
                      Edit
                    </Button>
                    <button
                      style={{
                        textAlign: "center",
                        float: "left",
                        marginLeft: "1px",
                        textDecoration: "none",
                        color: "white",
                        border: "1px solid dark",
                        backgroundColor: "red",
                        width: "30px",
                        height: "30px",
                        borderRadius: "25px",
                        MozBorderRadius: "30px",
                        WebkitBorderRadius: "30px",
                      }}
                      onClick={() => deleteList(item.id)}
                      className="btn btn-link btn-sm"
                    >
                      X
                    </button>
                  </li>
                </ul>
              ))}
          <Modal show={updateListModal} onHide={updateListCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Güncellemek istediğiniz listeyi giriniz</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                value={listname}
                onChange={(e) => setListname(e.target.value)}
                className="form-control"
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={updateListCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={updateList}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
          <br />
          <Button
            style={{ float: "right", textDecoration: "none" }}
            variant="success btn-sm"
            onClick={addListOpenModal}
          >
            Add List
          </Button>
          <Modal show={addListModal} onHide={addListCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Eklemek istediğiniz listenizi giriniz</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                value={listname}
                onChange={(e) => setListname(e.target.value)}
                className="form-control"
              ></input>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={addListCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={addList}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="col-8">
          <ListDetail
            goTitle={title}
            goSetTitle={setTitle}
            goListnameShow={showListname}
            goShowListDetail={showListDetails}
            goListId={id}
          />
        </div>
      </div>
    </div>
  );
}
export default List;
