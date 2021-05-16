
import './App.css';
import { ApolloClient,  createHttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import { setContext } from '@apollo/client/link/context';
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route,} from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/register";
import Home from './pages/HomePage'


  //------------------------------------------------------------------------------------//
  //                               Main Link for Graphql                                //
  //------------------------------------------------------------------------------------// 
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

  //------------------------------------------------------------------------------------//
  //                set the request's header containing the token                       //
  //------------------------------------------------------------------------------------// 
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = window.localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

  //------------------------------------------------------------------------------------//
  //                      concat the link with the header                               //
  //------------------------------------------------------------------------------------// 
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
   <Switch>
     
        <Route exact path="/" render={(props) => <Login client={client} />} />
        <Route exact path="/register" render={(props) => <Register client={client} />} />

        <Route
          path="/home"
          render={(props) => (
            <Home
              {...props} client={client}
            />
          )}
        /> 
      </Switch>
    </ApolloProvider>
  );
}

export default App;
