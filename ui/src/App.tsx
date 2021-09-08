import * as React from "react"
import {
  ChakraProvider,
  theme,
  Switch,
} from "@chakra-ui/react"
import {
  ProfilePage
} from './ProfilePage';
// import * as ReactRouter from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { ColorModeSwitcher } from "./ColorModeSwitcher"

//{/* <ColorModeSwitcher justifySelf="flex-end" /> */}

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router>
      <Switch>
        <Route exact={true} path="/">
          <ProfilePage useRandomAddress={true} />
        </Route>
        <Route path="/profile/:id">
          <ProfilePage useRandomAddress={false} />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
)
