import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink as Link } from "react-router-dom";
import { history } from "../../helpers/history";

import { useMutation, useQuery } from "@apollo/client";
import { SIGN_IN } from "../../graphql/mutations/auth.mutations";
import { CURRENT } from "../../graphql/queries/auth.queries";

import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../helpers/validations";

const Login = (props) => {
    const { data, error } = useQuery(CURRENT);

    const { 
        register,
        handleSubmit,
        reset,
        errors
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(loginSchema)
    });

    const [login, {loading}] = useMutation(SIGN_IN);
    const [loginError, setLoginError] = useState(false);

    const submitForm = dataForm => {
        login({ variables: { email: dataForm.email, password: dataForm.password } })
        .then(res => {
            const { login } = res.data;
            localStorage.setItem("auth", login);
            history.push(`/panel/comprobantes`);
        }).catch(err => {
            reset();
            document.getElementById("login_email").focus();
            setLoginError(true);

            setTimeout(() => {
                setLoginError(false);
            }, 5000);
        });
    };

    useEffect(() => {
		if(data){
            history.push(`/panel/comprobantes`);
		}else if(error && localStorage.getItem('auth')){	
            localStorage.removeItem('auth');
		}
	}, [data, error]);

    return (
        <div className="container" style={ { position: 'relative'  } }>
            <div id="top_login" className="row align-items-center">
                <div className="col-5">
                    <div className="box_logo dark mb-0 md text-left" style={ {padding: '20px 0'} }>
                        <Link to="/">
                        Loxa<span>Fac.</span>
                        </Link>
                    </div>
                </div>
                <div className="col-7">
                    <ul className="list-inline mb-0 text-right list_menu">
                        <li className="list-inline-item">
                            <Link to="/to-somewhere" className="green">
                                Planes
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="/to-somewhere" className="green">
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row justify-content-center align-items-center vh-100" style={{ paddingTop: '100px' }}>
                <div className="col-5">
                    <div className="login_box">
                        <h3 className="mb-4">Bienvenid@.</h3>
                        {loginError ? (<div className="alert alert-danger text-center" role="alert">
                            Credenciales incorrectas
                        </div>): null}
                        <form className="mb-5" onSubmit={handleSubmit(submitForm)}>
                            <div className="form-group">
                                <label htmlFor="login_email">Correo electrónico</label>
                                <input type="text" name="email" className={`form-control ${errors.email ? 'is-invalid':''}`} id="login_email" ref={register()} aria-label="Correo electrónico" autoComplete="off" />
                                <div className="invalid-feedback">
                                    { errors.email?.message }
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="login_password">Contraseña</label>
                                <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid':''}`} id="login_password" ref={register()} aria-label="Contraseña" autoComplete="off" />
                            </div>
                            <button type="submit" className="btn btn-green btn-block mb-2" disabled={ loading }>{loading ? (
                                <div className="spinner-border text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ): 'Ingresar'}</button>
                            {/*<Link to={ '/somewhere' } className="btn btn-light-green btn-block">
                                Registrarse
                            </Link>*/}
                        </form>
                        <div className="copyright">
                            <span>&copy; LoxaFac { new Date().getFullYear() }. Todos los derechos reservados.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;