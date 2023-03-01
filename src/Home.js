import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const usenavigate = useNavigate();
    const [todolist, todolistupdate] = useState([]);
    const [displayemail, displayemailupdate] = useState('');
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

    }, []);
    
    return (
        <div>
            <div className="header">
                <Link to={'/'}>Home</Link>
                <span style={{ marginLeft: '75%' }}>Welcome: <b>{displayemail}</b></span>
                <Link style={{ float: 'right' }} to={'/login'}>Logout</Link>
            </div>
            <h1 className="text-center">MovieToDo</h1>
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>ListName</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todolist && todolist.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.listName}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Home;
