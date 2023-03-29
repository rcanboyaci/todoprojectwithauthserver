import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { fetchWithHeaders } from "../../helpers/fetchHelpers";
import config from "../../configs/config";
import Swal from "sweetalert2";
import AddMovie from "./AddMovie";
import WatchedMovie from "./WatchedMovie";

const ListDetail = ({ title, setTitle, showListname, ListId }) => {
  const [addMovieModal, setAddMovieModal] = useState(false);
  const addMovieCloseModal = () => setAddMovieModal(false);
  const addMovieOpenModal = () => setAddMovieModal(true);
  const [movies, setMovies] = useState([]);
  const [movieToDoListId, setMovieToDoListId] = useState("");
  const [watched, setWatched] = useState(null);

  useEffect(() => {
    fetchWithHeaders(`${config.apiUrl}Movie/GetAllMovie`, "GET").then((resp) => {
      setMovies(resp.data);
    });
  }, []);

  function SelectMovie(e) {
    e.preventDefault();
    setMovieToDoListId(e.target.value);
  }

  function addMovie() {
    AddMovie(ListId, movieToDoListId, addMovieCloseModal, setTitle);
  }

  function DeleteMovie(mId) {
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchWithHeaders(
          `${config.apiUrl}MovieToDoList/RemoveMovieToDoList/${mId}`,
          "DELETE"
        ).then(() => {
          setTitle(title.filter((item) => item.id !== mId));
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }

  function watchedMovie(mtlId) {
    WatchedMovie(setTitle, title, mtlId, setWatched);
  }

  return (
    <>
      <div className="body">
        <div className="row">
          <div className="col-12">
            <div>
              <strong>{showListname}</strong>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  float: "right",
                  height: "2vh",
                  marginRight: "12px",
                }}
              >
                ✔️/✘
              </div>
            </div>
            {title &&
              title
                .sort((a, b) => a.id - b.id)
                .map((item) => (
                  <ul className="list-group" key={item.movieId} data={item}>
                    <li
                      className="list-group-item"
                      style={{ marginTop: "15px" }}
                    >
                      <div style={{ text: "center" }}>
                        {item.title}
                        <button
                          type="button"
                          style={{
                            border: item.watched ? "green" : "red",
                            color: item.watched ? "green" : "red",
                            float: "right",
                          }}
                          key={item.id}
                          onClick={() => watchedMovie(item.id)}
                          className="btn btn-outline-light btn-sm"
                        >
                          {item.watched ? "✔️" : "✘"}
                        </button>
                        <button
                          onClick={() => DeleteMovie(item.id)}
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
                          className="btn btn-link btn-sm"
                        >
                          X
                        </button>
                      </div>
                    </li>
                  </ul>
                ))}
            <br />
            <Button
              style={{ float: "right", textDecoration: "none" }}
              variant="success btn-sm"
              onClick={addMovieOpenModal}
            >
              Add Movie
            </Button>
            <Modal show={addMovieModal} onHide={addMovieCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Eklemek istediğiniz filmi seçiniz</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <select
                  className="custom-select"
                  value={movieToDoListId}
                  onChange={SelectMovie}
                >
                  <option value="-1">Select an option</option>
                  {movies &&
                    movies.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                </select>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={addMovieCloseModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={addMovie}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListDetail;
