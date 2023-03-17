import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

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
      .min(3, "Username en az 3 karakterden oluşmalıdır.")
      .required("Username alanı boş bırakılamaz."),
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

  const RegisterSubmit = async (values, { setErrors }) => {
    const inputValues = {
      username: values.username,
      password: values.password,
      email: values.email,
    };
    try {
      const response = await fetch(
        "https://localhost:7164/api/User/CreateUser",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(inputValues),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Kayıt Başarılı");
        navigate("/login");
      } else {
        setErrors({ error: data.error.errors });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={RegisterSubmit}
      >
        {({ isSubmitting, errors, setFieldValue, values }) => (
          <Form>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" placeholder="Email" />
            </div>
            <div>
              <ErrorMessage name="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field
                type={values.showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() =>
                  setFieldValue("showPassword", !values.showPassword)
                }
              >
                {values.showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <ErrorMessage name="password" />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Username"
              />
            </div>
            {errors && (
              <div>
                <ErrorMessage name="error" />
              </div>
            )}
            <div>
              <ErrorMessage name="username" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default Register;
