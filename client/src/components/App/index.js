import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "../Dashboard";
import Login from "../Login";
import HandleRedirect from "../HandleRedirect";
import { useCookies } from "react-cookie";
import { asyncFetch } from "../helpers/asyncFetch";
import Firebase from "../firebase";
const theme = createMuiTheme();

export const AuthContext = React.createContext();

function AuthContextProvider({ children }) {
  const [cookies] = useCookies();
  const [state, setState] = React.useState({});

  React.useEffect(() => {
    let currentTime = Date.now() / 1000;
    let access_token = cookies.access_token;
    let expires_at = cookies.expires_at;
    console.log("Checking permissions...");

    setState({
      cookies: cookies,
      status: "pending",
      loading: true
    });

    let athleteFetchUrl = "https://www.strava.com/api/v3/athlete";

    if (access_token && expires_at > currentTime) {
      asyncFetch(athleteFetchUrl, cookies.access_token)
        .then(data => {
          return data.json();
        })
        .then(user => {
          setState({
            user: user,
            status: "success",
            cookies: cookies,
            loading: false
          });
          const userUID = String(user.uid);
          Firebase.signIntoFirebase(userUID);
        });
    } else {
      setState({
        user: null,
        status: "error",
        cookies: cookies,
        loading: false
      });
      // GET NEW ACCESS TOKEN
    }
  }, [cookies]);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

const callBackendAPI = async () => {
  const response = await fetch("/express_backend");
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

export default function App() {
  const [state, setState] = useState({ data: null });

  React.useEffect(() => {
    callBackendAPI()
      .then(res => setState({ data: res.express }))
      .catch(err => console.log(err));
  }, []);

  return (
    <AuthContextProvider>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Dashboard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route path="/token" component={HandleRedirect}></Route>
          </Switch>
        </Router>
        <div>{state.data}</div>
      </MuiThemeProvider>
    </AuthContextProvider>
  );
}
