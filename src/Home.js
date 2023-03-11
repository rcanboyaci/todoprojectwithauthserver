import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function Home() {
    const usenavigate = useNavigate();
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [showlistName, showlistNameupdate] = useState('');
    const [displayemail, displayemailupdate] = useState('');
    const [todolist, todolistupdate] = useState([]);
    const [movies, setmovies] = useState([]);
    const [ListName, setlistName] = useState('');
    const [title, titleupdate] = useState('');
    const [id, idupdate] = useState(null);
    const [movielistId, movielistIdUpdate] = useState('');
    const [movietodoListwatched, setmovietodoListwatched] = useState(null);

    useEffect(() => {
        let email = sessionStorage.getItem('email');
        if (email === '' || email === null) {
            usenavigate('/login')
        }
        else {
            displayemailupdate(email);
        }
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch("https://localhost:7089/api/ToDoList/GetAllToDoList", {
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            todolistupdate(resp.data);
        }).catch((err) => {
            console.log(err.messsage)
        });

    }, [usenavigate]);

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        if (ListName === null || ListName === '') {
            isproceed = false;
            errormessage += ' Listname';
        }
        if (!isproceed) {
            toast.warning(errormessage)
        }
        return isproceed;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (IsValidate()) {
            let jwttoken = sessionStorage.getItem('jwttoken');
            let listName = ListName;
            let regobj = { listName };
            fetch("https://localhost:7089/api/ToDoList/SaveToDoList", {
                method: "POST",
                headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
                body: JSON.stringify(regobj)
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                if (todolist === null) {
                    todolistupdate([resp.data]);
                    handleClose2();
                }
                else {
                    todolistupdate([...todolist, resp.data]);
                    handleClose2();
                }
            });
        }
    }

    function handleUpdateSubmit(e) {
        e.preventDefault();
        if (IsValidate()) {
            let listName = ListName;
            let jwttoken = sessionStorage.getItem('jwttoken');
            let regobj = { id, listName };
            fetch(`https://localhost:7089/api/ToDoList/EditToDoList`, {
                method: "PUT",
                headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
                body: JSON.stringify(regobj)
            }).then(() => {
                fetch("https://localhost:7089/api/ToDoList/GetAllToDoList", {
                    method: "GET",
                    headers: { 'Authorization': 'bearer ' + jwttoken }
                }).then((res) => {
                    return res.json();
                }).then((resp) => {
                    todolistupdate(resp.data);
                }).catch((err) => {
                    console.log(err.messsage)
                });
            });
            handleClose1();
        };
    }

    const handleClick = (id) => {
        handleShow1(true);
        idupdate(id);
    };

    function deletehandleClick(id) {
        idupdate(id);
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch(`https://localhost:7089/api/ToDoList/RemoveToDoList/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            todolistupdate(todolist.filter((item) => item.id !== id));
            //titleupdate([]);
            const col8 = document.querySelector('.col-8');
            col8.style.display = 'none';
            return res.json();
        })
    };


    function handleButtonClick(id, listName) {
        const col8 = document.querySelector('.col-8');
        col8.style.display = 'block';
        idupdate(id);
        showlistNameupdate(listName);
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch(`https://localhost:7089/api/MovieToDoList/GetByListIdWithMovie/${id}`, {
            method: "GET",
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            if (resp.data === null) {
                toast.info(`${resp.errors}`);
            }
            titleupdate(resp.data);
        })
            .catch((err) => {
                console.log(err.messsage);
            });
    }

    useEffect(() => {
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch('https://localhost:7089/api/Movie/GetAllMovie', {
            method: "GET",
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            setmovies(resp.data)
        }).catch((err) => {
            console.log(err.messsage)
        });
    }, []);

    function handleSelectChange(e) {
        e.preventDefault();
        movielistIdUpdate(e.target.value);
    };

    function handleMovieSelect() {
        let jwttoken = sessionStorage.getItem('jwttoken');
        let todolistId = id;
        let movieId = movielistId;
        let regobj = { todolistId, movieId };
        fetch("https://localhost:7089/api/MovieToDoList/SaveMovieToDoList", {
            method: "POST",
            headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
            body: JSON.stringify(regobj)
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            if (resp.data === null) {
                toast.info(`${resp.errors}`);
            }
        }).catch(error => {
            console.error('Hata:', error);
        }).then(() => {
            fetch(`https://localhost:7089/api/MovieToDoList/GetByListIdWithMovie/${todolistId}`, {
                method: "GET",
                headers: {
                    'Authorization': 'bearer ' + jwttoken
                }
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                titleupdate(resp.data);
            })
                .catch((err) => {
                    console.log(err.messsage);
                });
            handleClose();
        })
    };


    function handledeleteMovie(mId) {
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch(`https://localhost:7089/api/MovieToDoList/RemoveMovieToDoList/${mId}`, {
            method: "DELETE",
            headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
        }).then((res) => {
            titleupdate(title.filter((item) => item.id !== mId));
            return res.json();
        }).catch((err) => {
            console.log(err.messsage);
        });
    };

    function handlewatched(mtlId) {
        titleupdate(title.map((item) => {
            if (item.id === mtlId) {
                return {
                    ...item,
                    watched: !item.watched
                };
            } else {
                return item;
            }
        }));
        let jwttoken = sessionStorage.getItem('jwttoken');
        let id = mtlId;
        let watched = true;
        let regobj = { id, watched };
        fetch("https://localhost:7089/api/MovieToDoList/EditMovieToDoList", {
            method: "PUT",
            headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
            body: JSON.stringify(regobj)
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            setmovietodoListwatched(resp);
        }).catch((err) => {
            console.log(err.messsage);
        });
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    return (
        <div>
            <div className="header">
                <Link to={'/'}><strong>Home</strong></Link>
                <span style={{ marginLeft: '75%' }}>Welcome: <b>{displayemail}</b></span>
                <Link style={{ float: 'right' }} to={'/login'}><strong>Logout</strong></Link>
            </div>
            <div className='body'>
                <div className="row">
                    <div className="col-4">
                        <div><strong>My List</strong></div>
                        {todolist && todolist.sort((a, b) => a.id - b.id).map(item => (
                            <ul className="list-group" key={item.id} data={item}>
                                <li className="list-group-item"><strong>{item.listName}</strong><button type='button' style={{ float: 'right' }} onClick={() => handleButtonClick(item.id, item.listName)} className='btn btn-outline-dark btn-sm'>☰</button>
                                    <Button style={{ float: 'right' }} onClick={() => handleClick(item.id)} variant="secondary btn-sm">Edit</Button><button style={{ float: 'left', textDecoration: 'none', color: 'red' }} onClick={() => deletehandleClick(item.id)} className="btn btn-link btn-sm">✕</button>
                                </li>
                            </ul>
                        ))}
                        <Modal show={show1} onHide={handleClose1}>
                            <Modal.Header closeButton>
                                <Modal.Title>Güncellemek istediğiniz listeyi giriniz</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><input type='text' value={ListName} onChange={e => setlistName(e.target.value)} className="form-control" ></input></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose1}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleUpdateSubmit}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <br />
                        <Button style={{ float: 'right', textDecoration: 'none' }} variant="success btn-sm" onClick={handleShow2}>
                            Add List
                        </Button>
                        <Modal show={show2} onHide={handleClose2}>
                            <Modal.Header closeButton>
                                <Modal.Title>Eklemek istediğiniz listenizi giriniz</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><input value={ListName} onChange={e => setlistName(e.target.value)} className="form-control" ></input></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose2}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className="col-8" style={{ display: 'none' }} >
                        <div className='body'>
                            <div className="row">
                                <div className="col-12">
                                    <div><strong>{showlistName}</strong><div style={{ display: 'flex', alignItems: 'center', float: 'right', height: '2vh' }}> <strong>Watched/Unwatched </strong></div></div>
                                    {title && title.sort((a, b) => a.id - b.id).map(item => (
                                        <ul className="list-group" key={item.movieId} data={item}>
                                            <li className="list-group-item"><strong>{item.title}</strong><button type='button' style={{ border: item.watched ? 'green' : 'red', color: item.watched ? 'green' : 'red', float: 'right' }} key={item.id} onClick={() => handlewatched(item.id)} className='btn btn-outline-light btn-sm'>{item.watched ? '✓' : 'X'}</button>
                                                <button onClick={() => handledeleteMovie(item.id)} style={{ float: 'left', textDecoration: 'none', color: 'red' }} className="btn btn-link btn-sm">✕</button>
                                            </li>
                                        </ul>
                                    ))}
                                    <br />
                                    <Button style={{ float: 'right', textDecoration: 'none' }} variant="success btn-sm" onClick={handleShow}>Add Movie</Button>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Eklemek istediğiniz filmi seçiniz</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body><select className="custom-select" value={movielistId} onChange={handleSelectChange} >
                                            <option value='-1'>Select an option</option>
                                            {movies && movies.map(item => (
                                                <option key={item.id} value={item.id}>{item.title}</option>
                                            ))}
                                        </select></Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleMovieSelect}>
                                                Save
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">      

            </div>
        </div >
    );
}
export default Home;
