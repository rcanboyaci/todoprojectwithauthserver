import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const [email, emailupdate] = useState('');
    const [password, passwordupdate] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const ProceedLoginusingAPI = (e) => {
        e.preventDefault();
        if (IsValidate()) {
            let inputobj = {
                "email": email,
                "password": password
            };
            fetch("https://localhost:7164/api/Auth/CreateToken", {
                method: 'POST',
                headers: { 'content-type': 'application/json;' },
                body: JSON.stringify(inputobj),
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                if (resp.statusCode !== 200) {
                    toast.error('Login failed, invalid credentials');
                } else {
                    toast.success('Success');
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('jwttoken', resp.data.accessToken);
                    usenavigate('/');
                }
            }).catch((err) => {
                toast.error('Login Failed due to :' + err.message);
            });
        }
    }
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

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                <form className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group col-lg-11">
                                <label>Email <span className="errmsg">*</span></label>
                                <input type="email" value={email} onChange={e => emailupdate(e.target.value)} className="form-control" placeholder='Email@x.com/com.tr' />
                            </div>
                            <div className="form-group col-lg-11">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => passwordupdate(e.target.value)} className="form-control" placeholder='Password'></input>
                                <button style={{ float: 'right', marginTop: '2px' }} type='button' className="btn btn-sm btn-info" onClick={handleShowPassword}>{showPassword ? 'Gizle' : 'Göster'}</button>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="button" onClick={ProceedLoginusingAPI} className="btn btn-primary">Login</button> /
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;