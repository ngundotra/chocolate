import * as React from "react"
import {
  ChakraProvider,
  Box,
  theme,
} from "@chakra-ui/react"
import {
  ProfilePage
} from './ProfilePage';
// import * as ReactRouter from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
// import { ColorModeSwitcher } from "./ColorModeSwitcher"

//{/* <ColorModeSwitcher justifySelf="flex-end" /> */}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router> 
      <Switch>
        <Route exact={true} path="/" >
          <Redirect to="/profile/9fETpNpWQY2jhXXd8WEhfaLVdNsvBAT4J2gPHqyZKw7H" />
        </Route>
        <Route path="/profile/:address">
          <ProfilePage />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
)
