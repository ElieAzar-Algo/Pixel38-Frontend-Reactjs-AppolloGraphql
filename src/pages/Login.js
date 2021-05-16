import React from "react";
import { Redirect, Link } from "react-router-dom";
import { gql } from "@apollo/client";

// import "./LoginStyle.css";

class Login extends React.Component {
  state = {
    auth: 0,
    err: "",
    token: "",
  };

  loginCheck = async (e) => {
    e.preventDefault();

    const testQuery = gql`
    mutation{
      login(
          email:"${document.querySelector("#inputEmail").value}"
          password:"${document.querySelector("#inputPassword").value}"
          )
    }
    `;
    this.props.client
      .mutate({
        mutation: testQuery,
      })
      .then((res) => {
        if (res.data.login !== null) {
          window.localStorage.setItem("token", res.data.login);
          this.setState({ token: res.data.login });
          console.log(res);
          alert("Login Successfully");
          this.setState({ auth: 200 });
        } else {
          alert("Login Failed");
          this.setState({ auth: 400 });
        }
      });
  };

  render() {
    if (this.state.auth === 200) {
      return (
        <Redirect
          to={{
            pathname: `./home`,
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
                    <h5 className="card-title text-center">Sign In</h5>
                    <form
                      className="form-signin"
                      onSubmit={this.loginCheck}
                      method="post"
                    >
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
                          Sign in
                        </button>
                      </div>
                      <Link
                        style={{ marginLeft: "40%" }}
                        to={{
                          pathname: "./register",
                        }}
                      >
                        <span>register</span>
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
export default Login;
