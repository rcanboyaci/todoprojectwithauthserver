import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Home() {
    const usenavigate = useNavigate();
    const [todolist, todolistupdate] = useState([]);
    const [displayemail, displayemailupdate] = useState('');
    const [listName, listNameupdate] = useState('');
    const [id, idupdate] = useState(null);
    //const [movieId, movieIdupdate] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [title, titleupdate] = useState(null);


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
        if (listName === null || listName === '') {
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
            let regobj = { listName };
            fetch("https://localhost:7089/api/ToDoList/SaveToDoList", {
                method: "POST",
                headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
                body: JSON.stringify(regobj)
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                listNameupdate(resp.data.listName);
                console.log(resp);
            });
            window.location.reload();

        }
    }

    function handleUpdateSubmit(e) {
        e.preventDefault();
        if (IsValidate()) {
            let jwttoken = sessionStorage.getItem('jwttoken');
            let regobj = { id, listName };
            fetch("https://localhost:7089/api/ToDoList/EditToDoList", {
                method: "PUT",
                headers: { 'content-type': 'application/json', 'Authorization': 'bearer ' + jwttoken },
                body: JSON.stringify(regobj)
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                listNameupdate(resp.data.listName);
                console.log(resp);
            });
            window.location.reload();
        }
    }

    const handleClick = (id) => {
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
            return res.json();
        }).then((resp) => {
            titleupdate(resp.data);
        }).catch((err) => {
            console.log(err.messsage)
        });
        window.location.reload();
    };


    function handleButtonClick(id) {
        setShowDetails(showDetails);
        idupdate(id);
        let jwttoken = sessionStorage.getItem('jwttoken');
        fetch(`https://localhost:7089/api/MovieToDoList/GetByListIdWithMovie/${id}`, {
            method: "GET",
            headers: {
                'Authorization': 'bearer ' + jwttoken
            }
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            titleupdate(resp.data);
        }).catch((err) => {
            console.log(err.messsage)
        });
    }

    function Detail(props) {
        if (props.showDetails) {
            return null;
        }
        return (
            <div>
                <div className='body'>
                    <div className="row">
                        <div className="col-12">
                            <h2>List Detail</h2>
                            {title && title.map(item => (
                                <ul className="list-group" key={item.movieId} data={item}>
                                    <li className="list-group-item"><strong>{item.title}</strong><button type='button' style={{ float: 'right' }} className='btn btn-outline-success btn-sm'>✓</button>
                                        <button style={{ float: 'left', textDecoration: 'none', color: 'red' }} className="btn btn-link btn-sm">X</button>
                                    </li>
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        );
    }

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
                        <h2>My List</h2>
                        {todolist && todolist.map(item => (
                            <ul className="list-group" key={item.id} data={item}>
                                <li className="list-group-item"><strong>{item.listName}</strong><button type='button' style={{ float: 'right' }} onClick={() => handleButtonClick(item.id)} className='btn btn-outline-dark btn-sm'>Detail</button>
                                    <button style={{ float: 'right' }} onClick={() => handleClick(item.id)} className="btn btn-secondary btn-sm" data-toggle="modal" data-target="#exampleModal">Edit</button><button style={{ float: 'left', textDecoration: 'none', color: 'red' }} onClick={() => deletehandleClick(item.id)} className="btn btn-link btn-sm">X</button>
                                </li>
                            </ul>
                        ))}
                        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Güncelleme işlemi.</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <input value={listName} onChange={e => listNameupdate(e.target.value)} className="form-control" ></input>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" onClick={handleUpdateSubmit} className="btn btn-primary">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <button style={{ float: 'right' }} className="btn btn-success btn-sm" data-toggle="modal" data-target="#exampleModal1">Add List</button>
                        <div className="modal fade" id="exampleModal1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel1">Lütfen bir liste ekleyiniz.</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <input value={listName} onChange={e => listNameupdate(e.target.value)} className="form-control" ></input>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary " data-dismiss="modal">Geri</button>
                                        <button type="button" onClick={handleSubmit} className="btn btn-primary ">Kaydet</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        {<Detail showDetails={showDetails} />}
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Home;
