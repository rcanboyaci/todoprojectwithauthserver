import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { fetchWithHeaders } from "./helpers/fetchHelpers";

const Login = () => {
  const usenavigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    error: "",
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const LoginSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Şifre en az altı karakter, en az bir harf, bir rakam ve bir özel karakter içermelidir."
      )
      .required("Password alanı boş bırakılamaz."),
    email: Yup.string()
      .email(
        "Yanlış biçimde email girdiniz Örn:xyz@xyz.com biçiminde olmalıdır."
      )
      .required("Email alanı boş bırakılamaz."),
  });

  const LoginSubmit = (values, { setErrors }) => {
    const inputValues = {
      password: values.password,
      email: values.email,
    };
      fetchWithHeaders(
        "https://localhost:7164/api/Auth/CreateToken",
        "POST",
        inputValues
      ).then((resp)=>{
        if (resp.statusCode===200) {
          toast.success("Giriş işlemi başarılı");
          sessionStorage.setItem("email", values.email);
          sessionStorage.setItem("jwttoken", resp.data.accessToken);
          usenavigate("/");
        } else {
          setErrors({ error: resp.error.errors });
        }
      });
}

  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={LoginSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" />
            </div>
            {errors && (
              <div>
                <ErrorMessage name="error" />
              </div>
            )}
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
