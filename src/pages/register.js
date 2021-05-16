import React from "react";
import { Redirect, Link } from "react-router-dom";
import { gql } from "@apollo/client";

// import "./LoginStyle.css";

class Register extends React.Component {
  state = {
    auth: 0,
    err: "",
    token: "",
  };

  register = async (e) => {
    e.preventDefault();

    const registerQuery = gql`
    mutation{
        createUser(
          name:"${document.querySelector("#inputName").value}"
          email:"${document.querySelector("#inputEmail").value}"
          password:"${document.querySelector("#inputPassword").value}"
          )
          {
              id
              name

          }
    }
    `;
    this.props.client
      .mutate({
        mutation: registerQuery,
      })
      .then((res) => {
        if (res.data.login !== null) {
          window.localStorage.setItem("token", res.data.login);
          this.setState({ token: res.data.login });
          console.log(res);
          alert("Register Successfully");
          this.setState({ auth: 200 });
        } else {
          alert("Register Failed");
          this.setState({ auth: 400 });
        }
      });
  };

  render() {
    if (this.state.auth === 200) {
      return (
        <Redirect
          to={{
            pathname: `./`,
            state: { token: this.state.token },
          }}
        />
      );
    }

    return (
      <>
        <div className=" loginRoot">
          <div className="container ">
            <div className="row ">
              <div className="col-sm-9 col-md-7 col-lg-5 mx-auto ">
                <div className="card card-signin my-5 ">
                  <div className="card-body">
                    <h5 className="card-title text-center">Register</h5>
                    <form
                      className="form-signin"
                      onSubmit={this.register}
                      method="post"
                    >
                      <div className="form-label-group">
                        <input
                          type="text"
                          name="adminName"
                          id="inputName"
                          className="form-control"
                          placeholder="Name"
                          autoComplete
                          required
                          autoFocus
                        />
                        <label htmlFor="inputName">Email address</label>
                      </div>
                      <div className="form-label-group">
                        <input
                          type="email"
                          name="adminEmail"
                          id="inputEmail"
                          className="form-control"
                          placeholder="Email address"
                          autoComplete
                          required
                          autoFocus
                        />
                        <label htmlFor="inputEmail">Email address</label>
                      </div>

                      <div className="form-label-group">
                        <input
                          type="password"
                          name="adminPassword"
                          id="inputPassword"
                          className="form-control"
                          placeholder="Password"
                          required
                          autoComplete
                        />
                        <label htmlFor="inputPassword">Password</label>
                      </div>

                      <div className="row custom-control custom-checkbox mb-3">
                        <button
                          className="btn btn-lg btn-primary btn-block text-uppercase"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                      <Link
                        style={{ marginLeft: "40%" }}
                        to={{
                          pathname: "./",
                        }}
                      >
                        <span>Login</span>
                      </Link>
                      <hr className="my-4" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Register;
