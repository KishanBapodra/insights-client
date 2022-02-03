import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom"
import { AuthProvider } from "./context/auth"
import ProtectedRoute from "./authentication/protected.route"
import "./index.css"
import Login from "./authentication/login"
import SignUp from "./authentication/signup"
import App from "./app"

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<Router>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/signup" component={SignUp}/>
					<ProtectedRoute path="/app" component={App}/>
					<Route path="/">
						<Redirect to="/app"/>
					</Route>
				</Switch>
			</Router>
		</AuthProvider>
	</React.StrictMode>,
	document.getElementById("root")
)
