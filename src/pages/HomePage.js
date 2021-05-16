import React from "react";
import { Redirect } from "react-router-dom";
import { Table, Button,FormGroup } from "react-bootstrap";

import {gql } from '@apollo/client';


export default class Home extends React.Component {
  state = {
    me: [],
    orders: [],
    token: "",
    createForm: false,
    userInputs: [],
    hideElement:false,
    editId: 0,
    editForm: false,
    error: "",
    handleKey: -1,
  };

  //------------------------------------------------------------------------------------//
  //                  starting function (component life cycle)                          //
  //------------------------------------------------------------------------------------//
  async componentDidMount(props) {
    this.getOrders();
    this.setState({ token: this.props.location.state.token });
  }
  //------------------------------------------------------------------------------------//
  //                  catch inputs in an OBJECT of keys and values                      //
  //------------------------------------------------------------------------------------//
  catchInput = (e) => {
    e.persist();
    this.setState({
      userInputs: { ...this.state.userInputs, [e.target.name]: e.target.value },
    });
    console.log(this.state.userInputs);
  };

  //------------------------------------------------------------------------------------//
  //                            control table's buttons                                 //
  //------------------------------------------------------------------------------------//
  handleKeyLevel = (key) => {
    if (this.state.handleKey !== key) {
      this.setState({ handleKey: key });
    } else {
      this.setState({ handleKey: -1 });
    }
  };

  //------------------------------------------------------------------------------------//
  //                  fetch all user's orders ans user credentials                      //
  //------------------------------------------------------------------------------------//
  getOrders = () => {
    const getQuery = gql`
      {
        me {
          id
          name
          shipments {
            id
            user_id
            waybill
            customer_name
            customer_address
            customer_phone
          }
        }
      }
    `;
    this.props.client
      .query({
        query: getQuery,
      })
      .then((res) => {
        // console.log(res.data.me.shipments)
        this.setState({ orders: res.data.me.shipments });
        this.setState({ me: res.data.me });
        console.log(res.data.me);
      });
  };

  //------------------------------------------------------------------------------------//
  //                  create new order related to the logged in us                      //
  //------------------------------------------------------------------------------------//

  createOrder = (e) => {
    // for (var key in this.state.userInputs) {
    //     if (this.state.userInputs.hasOwnProperty(key)) {
    //         console.log(key+':'+ this.state.userInputs[key]);
    //     }
    // }

    const createQuery = gql`
    mutation{
        createShipment(
            user_id:${this.state.me.id}
            waybill:"${document.querySelector("#waybill").value}"
            customer_name:"${document.querySelector("#customer_name").value}"
            customer_address:"${
              document.querySelector("#customer_address").value
            }"
            customer_phone:"${document.querySelector("#customer_phone").value}"
        )
        {
            id
        }
    }
    `;
    this.props.client
      .mutate({
        mutation: createQuery,
      })
      .then((res) => {
        this.getOrders();
        window.location.reload();
        console.log(res);
      });
  };

  //------------------------------------------------------------------------------------//
  //                            delete order from the list                              //
  //------------------------------------------------------------------------------------//
  deleteOrder = (id) => {
    const deleteQuery = gql`
    mutation{
        deleteShipment(id:${id})
        {
            id
        }
    }
    `;
    this.props.client
      .mutate({
        mutation: deleteQuery,
      })
      .then((res) => {
        this.getOrders();
        console.log(res);
        window.location.reload();
      });
  };

  //------------------------------------------------------------------------------------//
  //                                    Edit Order                                      //
  //------------------------------------------------------------------------------------//
  //updateShipment
  updateOrder = (id) => {

    const editQuery = gql`
    mutation{
        updateShipment(
            id:${this.state.editId}
            user_id:${this.state.me.id}
            waybill:"${document.querySelector("#waybill-table").value}"
            customer_name:"${document.querySelector("#customer_name-table").value}"
            customer_address:"${document.querySelector("#customer_address-table").value}"
            customer_phone:"${document.querySelector("#customer_phone-table").value}"
        )
        {
            id
        }
    }
    `;
    this.props.client
      .mutate({
        mutation: editQuery,
      })
      .then((res) => {
        this.getOrders();
        window.location.reload();
        console.log(res);
      })
      

  };


  logout = async (e) => {};

  render() {
    //------------------------------------------------------------------------------------//
    //      get token from the login page and compare it with the localStorage token      //
    //------------------------------------------------------------------------------------//

    const isToken = window.localStorage.getItem("token");

    if (!isToken && isToken !== this.state.token) {
      return <Redirect to="./" />;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row mb-3"></div>

            <h3> Order Listing Page </h3>
            <div className="row mb-4">
              <Button
                onClick={() =>
                  this.setState({ createForm: !this.state.createForm })
                }
              >
                Create New Order
              </Button>
            </div>
            <div className="row mb-4" hidden={!this.state.createForm}>
              <div className="col-md-3">
                <FormGroup>
                  <label htmlFor="waybill">Waybill :</label>
                  <div>
                    <input
                      type="text"
                      id="waybill"
                      onChange={this.catchInput}
                      name="waybill"
                    />
                  </div>
                </FormGroup>
              </div>

              <div className="col-md-3">
                <FormGroup>
                  <label htmlFor="customer_name">Customer Name :</label>
                  <div>
                    <input
                      type="text"
                      id="customer_name"
                      onChange={this.catchInput}
                      name="customer_name"
                    />
                  </div>
                </FormGroup>
              </div>

              <div className="col-md-3">
                <FormGroup>
                  <label htmlFor="customer_address">Customer Address :</label>
                  <div>
                    <input
                      type="text"
                      id="customer_address"
                      onChange={this.catchInput}
                      name="customer_address"
                    />
                  </div>
                </FormGroup>
              </div>

              <div className="col-md-3">
                <FormGroup>
                  <label htmlFor="customer_phone">Customer Phone :</label>
                  <div>
                    <input
                      type="text"
                      id="customer_phone"
                      onChange={this.catchInput}
                      name="customer_phone"
                    />
                  </div>
                </FormGroup>
              </div>
              <div>
                <Button size="sm" onClick={this.createOrder}>
                  Submit Order
                </Button>
              </div>
            </div>

            <div className="row">
              <Table style={{ marginLeft: "10px", marginRight:"10px" }} striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Order ID</th>
                    <th style={{ width: "15%" }}>Waybill</th>
                    <th style={{ width: "15%" }}>Client</th>
                    <th style={{ width: "30%" }}>Address</th>
                    <th style={{ width: "15%" }}>Phone Number</th>

                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.orders.map((order, key) => (
                    <tr key={key}>
                      <td style={{ width: "5%" }}>{order.id}</td>
                      
                      <td hidden={this.state.handleKey===key}> {order.waybill} </td>
                      <td hidden={this.state.handleKey!==key}> 
                          <input
                           // style={{ width: "90%" }}
                            disabled={this.state.handleKey!==key}
                            defaultValue={order.waybill}
                            type="text"
                            id="waybill-table"
                            name="waybill"/>
                      </td>

                      <td hidden={this.state.handleKey===key}> {order.customer_name} </td>
                      <td hidden={this.state.handleKey!==key}> 
                          <input
                         // style={{ width: "90%" }}
                            disabled={this.state.handleKey!==key}
                            defaultValue={order.customer_name}
                            type="text"
                            id="customer_name-table"
                            name="customer_name"/>
                      </td>

                      <td hidden={this.state.handleKey===key}> {order.customer_address} </td>
                      <td hidden={this.state.handleKey!==key}> 
                          <input
                            disabled={this.state.handleKey!==key}
                            defaultValue={order.customer_address}
                            type="text"
                            id="customer_address-table"
                            name="customer_address"/>
                      </td>

                      <td hidden={this.state.handleKey===key}> {order.customer_phone} </td>
                      <td hidden={this.state.handleKey!==key}> 
                          <input
                            disabled={this.state.handleKey!==key}
                            defaultValue={order.customer_phone}
                            type="text"
                            id="customer_phone-table"
                            name="customer_phone"/>
                      </td>
                      

                      <td style={{ width: "30%" }}>
                        <Button
                        hidden={this.state.hideElement}
                          onClick={() => {
                            this.handleKeyLevel(key);
                            this.setState({hideElement:true})
                            this.setState({ editId: order.id });
                          }}
                          style={{ marginRight: "10px" }}
                          variant="warning"
                          size="sm"
                        >
                          Edit
                        </Button>

                        <Button
                        hidden={!this.state.hideElement}
                        disabled={this.state.handleKey!==key}
                          onClick={() => {
                            
                            this.setState({hideElement:false})
                            this.setState({handleKey:-1})
                            this.updateOrder();
                          }}
                          style={{ marginRight: "10px" }}
                          variant="warning"
                          size="sm"
                        >
                          Submit Changes
                        </Button>

                        <Button
                        hidden={this.state.hideElement}
                          onClick={() => {
                            this.deleteOrder(order.id);
                          }}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
