import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
        "Password must contain at least minimum six characters, at least one letter, one number and one special character."
      )
      .required("Parola zorunludur"),
    email: Yup.string()
      .email("Lütfen geçerli bir email adresi giriniz.")
      .required("Email zorunludur."),
  });

  const LoginSubmit = async (values, { setErrors }) => {
    const inputValues = {
      password: values.password,
      email: values.email,
    };
    try {
      const response = await fetch(
        "https://localhost:7164/api/Auth/CreateToken",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(inputValues),
        }
      );
      const tokendata = await response.json();
      if (response.ok) {
        toast.success("Giriş işlemi başarılı");
        sessionStorage.setItem("email", values.email);
        sessionStorage.setItem("jwttoken", tokendata.data.accessToken);
        usenavigate("/");
      } else {
        setErrors({ error: tokendata.error.errors });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
