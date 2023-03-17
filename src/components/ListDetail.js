import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const ListDetail = (props) => {
  const [addMovieModal, setAddMovieModal] = useState(false);
  const addMovieCloseModal = () => setAddMovieModal(false);
  const addMovieOpenModal = () => setAddMovieModal(true);
  const [movies, setMovies] = useState([]);
  const [movieToDoListId, setMovieToDoListId] = useState("");
  const [watched, setWatched] = useState(null);

  useEffect(() => {
    let jwttoken = sessionStorage.getItem("jwttoken");
    fetch("https://localhost:7089/api/Movie/GetAllMovie", {
      method: "GET",
      headers: {
        Authorization: "bearer " + jwttoken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setMovies(resp.data);
      })
      .catch((err) => {
        console.log(err.messsage);
      });
  }, []);

  function SelectMovie(e) {
    e.preventDefault();
    setMovieToDoListId(e.target.value);
  }

  function AddMovie() {
    let jwttoken = sessionStorage.getItem("jwttoken");
    let todolistId = props.goListId;
    let movieId = movieToDoListId;
    let regobj = { todolistId, movieId };
    fetch("https://localhost:7089/api/MovieToDoList/SaveMovieToDoList", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + jwttoken,
      },
      body: JSON.stringify(regobj),
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        if (resp.data === null) {
          toast.info(`${resp.errors}`);
        }
      })
      .catch((error) => {
        console.error("Hata:", error);
      })
      .then(() => {
        fetch(
          `https://localhost:7089/api/MovieToDoList/GetByListIdWithMovie/${todolistId}`,
          {
            method: "GET",
            headers: {
              Authorization: "bearer " + jwttoken,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((resp) => {
            props.goSetTitle(resp.data);
          })
          .catch((err) => {
            console.log(err.messsage);
          });
        addMovieCloseModal();
      });
  }

  function DeleteMovie(mId) {
    let jwttoken = sessionStorage.getItem("jwttoken");
    fetch(
      `https://localhost:7089/api/MovieToDoList/RemoveMovieToDoList/${mId}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "bearer " + jwttoken,
        },
      }
    )
      .then((res) => {
        props.goSetTitle(props.goTitle.filter((item) => item.id !== mId));
        return res.json();
      })
      .catch((err) => {
        console.log(err.messsage);
      });
  }

  function WatchedMovie(mtlId) {
    props.goSetTitle(
      props.goTitle.map((item) => {
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
    let jwttoken = sessionStorage.getItem("jwttoken");
    let id = mtlId;
    let watched = true;
    let regobj = { id, watched };
    fetch("https://localhost:7089/api/MovieToDoList/EditMovieToDoList", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "bearer " + jwttoken,
      },
      body: JSON.stringify(regobj),
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setWatched(resp);
      })
      .catch((err) => {
        console.log(err.messsage);
      });
  }

  return (
    <>
      {props.goShowListDetail === props.goListId && (
        <div className="body">
          <div className="row">
            <div className="col-12">
              <div>
                <strong>{props.goListnameShow}</strong>
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
              {props.goTitle &&
                props.goTitle
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
                            onClick={() => WatchedMovie(item.id)}
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
                  <Button variant="primary" onClick={AddMovie}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListDetail;
