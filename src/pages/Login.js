import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { fetchWithHeaders } from "../helpers/fetchHelpers";
import { toast } from "react-toastify";
import config from "../configs/config";

const Login = () => {
  const usenavigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    error: "",
    showPassword: false,
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "(Şifre en az altı karakter, en az bir harf, bir rakam ve bir özel karakter içermelidir.)"
      )
      .required("(Password alanı boş bırakılamaz.)"),
    email: Yup.string()
      .email(
        "(Yanlış biçimde email girdiniz Örn:xyz@xyz.com biçiminde olmalıdır.)"
      )
      .required("(Email alanı boş bırakılamaz.)"),
  });

  const LoginSubmit = (values, { setErrors, setSubmitting, resetForm }) => {
    const inputValues = {
      password: values.password,
      email: values.email,
    };
    fetchWithHeaders(
      `${config.authUrl}Auth/CreateToken`,
      "POST",
      inputValues
    ).then((resp) => {
      if (resp.statusCode === 200) {
        toast.success("Giriş işilemi başarılı.");
        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("jwttoken", resp.data.accessToken);
        usenavigate("/");
      } else {
        setErrors({ error: resp.error.errors });
        setTimeout(() => {
          setSubmitting(false);
          resetForm();
        }, 1000);
      }
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="offset-lg-4 col-lg-4">
        <div className="container">
          <div className="card">
            <div
              className="card-header"
              style={{
                textAlign: "center",
                color: "white",
                backgroundColor: "orange",
              }}
            >
              <h1>Login</h1>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={LoginSubmit}
            >
              {({ isSubmitting, errors, setFieldValue, values }) => (
                <Form>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label htmlFor="email">
                            <strong>Email</strong>
                          </label>
                          <Field
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="email" />
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label htmlFor="password">
                            <strong>Password</strong>
                          </label>
                          <Field
                            className="form-control"
                            type={values.showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Password"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <button
                          style={{ float: "right" }}
                          className="btn btn-dark btn-sm"
                          type="button"
                          onClick={() =>
                            setFieldValue("showPassword", !values.showPassword)
                          }
                        >
                          {values.showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="password" />
                      </div>
                      {errors && (
                        <div style={{ color: "red" }}>
                          <ErrorMessage name="error" />
                        </div>
                      )}
                      <br />
                      <div className="card-footer">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm"
                          disabled={isSubmitting}
                        >
                          Login
                        </button>
                        <Link
                          to={"/register"}
                          style={{ float: "right" }}
                          className="btn btn-info btn-sm"
                        >
                          New User
                        </Link>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
