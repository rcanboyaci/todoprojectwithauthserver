import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import config from "../configs/config";
import { fetchWithHeaders } from "../helpers/fetchHelpers";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    username: "",
    error: "",
    showPassword: false,
  };

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "(Username en az 3 karakterden oluşmalıdır.)")
      .required("(Username alanı boş bırakılamaz.)"),
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

  const RegisterSubmit = (values, { setErrors, resetForm, setSubmitting }) => {
    const inputValues = {
      username: values.username,
      password: values.password,
      email: values.email,
    };
    fetchWithHeaders(
      `${config.authUrl}User/CreateUser`,
      "POST",
      inputValues
    ).then((resp) => {
      console.log(resp);
      if (resp.statusCode === 200) {
        Swal.fire("Kayıt Başarılı");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
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
              <h1>User Registeration</h1>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={RegisterSubmit}
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
                          type="button"
                          style={{ float: "right" }}
                          className="btn btn-secondary btn-sm"
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
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label htmlFor="username">
                            <strong>Username</strong>
                          </label>
                          <Field
                            className="form-control"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                          />
                        </div>
                      </div>
                      {errors && (
                        <div style={{ color: "red" }}>
                          <ErrorMessage name="error" />
                        </div>
                      )}
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="username" />
                      </div>
                      <div className="card-footer">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm"
                          disabled={isSubmitting}
                        >
                          Register
                        </button>
                        <Link
                          to={"/login"}
                          style={{ float: "right" }}
                          className="btn btn-info btn-sm"
                        >
                          Login
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
export default Register;
