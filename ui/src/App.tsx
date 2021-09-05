import * as React from "react"
import {
  ChakraProvider,
  Box,
  theme,
} from "@chakra-ui/react"
import {
  ProfilePage
} from './ProfilePage';
import { ColorModeSwitcher } from "./ColorModeSwitcher"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <ProfilePage />
    </Box>
  </ChakraProvider>
)
