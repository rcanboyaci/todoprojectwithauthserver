import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {

    const [userName, usernamechange] = useState("");
    const [email, emailchange] = useState("");
    const [password, passwordchange] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const IsValidate = () => {
        let isproceed = true;
        let errormessage = 'Please enter the value in ';
        if (email === null || email === '') {
            isproceed = false;
            errormessage += ' Email';
        }
        if (password === null || password === '') {
            isproceed = false;
            errormessage += ' Password';
        }
        if (userName === null || userName === '') {
            isproceed = false;
            errormessage += ' Username';
        }

        if (!isproceed) {
            toast.warning(errormessage)
        }
        else {
            if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {

            }
            else {
                isproceed = false;
                toast.warning('Please enter the valid email')
            }
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
            }
            else {
                isproceed = false;
                toast.warning('Password must contain at least minimum six characters, at least one letter, one number and one special character.')
            }
        }
        return isproceed;
    }


    const handlesubmit = (e) => {
        e.preventDefault();
        let regobj = { userName, email, password };
        if (IsValidate()) {
            fetch("https://localhost:7164/api/User/CreateUser", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(regobj)
            }).then((res) => {
                if (res.status === 200) {
                    toast.success('Registered successfully.')
                    navigate('/login');
                }
                else {
                    toast.error('Username or Email is already taken.');
                }
            }).catch((err) => {
                toast.error('Failed :' + err.message);
            });
        }
    }

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };


    return (
        <div style={{marginTop:'20px'}}>
            <div className="offset-lg-3 col-lg-6">
                <form className="container">
                    <div className="card">
                        <div className="card-header">
                            <h1>User Registeration</h1>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email <span className="errmsg">*</span></label>
                                        <input type='email' value={email} onChange={e => emailchange(e.target.value)} className="form-control" placeholder="Email@x.com\com.tr"></input>
                                    </div>
                                </div>
                                <div className="col-lg-5">
                                    <div className="form-group ">
                                        <label>Password <span className="errmsg">*</span></label>
                                        <input value={password} onChange={e => passwordchange(e.target.value)} type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Password"></input>
                                    </div>
                                </div>
                                <div className="col-lg-1">
                                    <div className="form-group ">
                                        <button style={{ float: 'right',marginTop:'35px' }} className="btn btn-sm btn-info" onClick={handleShowPassword}>{showPassword ? 'Gizle' : 'Göster'}</button>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Username <span className="errmsg">*</span></label>
                                        <input type='text' value={userName} onChange={e => usernamechange(e.target.value)} className="form-control" placeholder="Username"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="button" onClick={handlesubmit} className="btn btn-primary">Register</button> |
                            <Link to={'/login'} className="btn btn-danger">Close</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Register;
