import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListDetail from "../ListDetail/GetListDetail";
import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";
import AddList from "./AddList";
import UpdateList from "./UpdateList";
import Swal from "sweetalert2";
import DetailList from "../ListDetail/DetailList";

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
    let email = sessionStorage.getItem("email");
    if (email === "" || email === null) {
      usenavigate("/login");
    } else {
      fetchWithHeaders(`${config.apiUrl}ToDoList/GetAllToDoList`, "GET").then(
        (resp) => {
          if (resp.data !== null) {
            setList(resp.data);
          } else {
            setList([...list]);
            Swal.fire(`${resp.errors}`);
          }
        }
      );
      setTimeout(() => {
        fetchWithHeaders(`${config.apiUrl}Refresh/GetAllIMDBAPIMovie`, "GET");
      }, 1000);
    }
  }, [usenavigate]);

  function addList(e) {
    AddList(e, listname, list, setList, addListCloseModal);
  }

  const editButton = (id) => {
    updateListOpenModal(true);
    setListId(id);
  };

  function updateList(e) {
    UpdateList(e, listname, id, setList, updateListCloseModal);
  }

  function deleteList(id) {
    setListId(id);
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchWithHeaders(
          `${config.apiUrl}ToDoList/RemoveToDoList/${id}`,
          "DELETE"
        ).then(() => {
          setList(list.filter((item) => item.id !== id));
          setShowListDetails(false);
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  function detailList(id, listname) {
    DetailList(
      id,
      listname,
      setShowListDetails,
      setListId,
      setShowListname,
      setTitle
    );
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
          {showListDetails === id && (
            <ListDetail
              title={title}
              setTitle={setTitle}
              showListname={showListname}
              showListDetails={showListDetails}
              ListId={id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default List;
