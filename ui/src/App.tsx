import './App.css';
import React from 'react';
import theme from './theme';
import { Button, CodeIcon, LogOutIcon, ThemeProvider } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';

import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Fragments
import { version } from './version';
import GLOBALS from './globals';
import Journal from './pages/Journal';

const bgImage = `linear-gradient(45deg, rgba(57, 78, 92, 0.95), rgba(142, 189, 181, 0.47)), 
url('https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg')`;

function LoginScreen() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Pane
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundImage: bgImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <img src="continuum_logo_white.png" alt="Continuum Logo" width={100} height={100} />
      <h1
        style={{
          fontSize: 72,
          fontWeight: 300,
          fontFamily: 'Oxygen',
          color: theme.colors.white
        }}
      >
        Continuum
      </h1>
      <Button appearance="secondary" onClick={() => loginWithRedirect()} size="large">
        Login
      </Button>
    </Pane>
  );
}

function RoutedApp() {
  const { logout } = useAuth0();

  const links = [
    {
      name: `Version: ${version}`,
      icon: CodeIcon,
      disabled: true,
      onClick: () => null
    },
    {
      name: 'Logout',
      icon: LogOutIcon,
      onClick: () => logout()
    }
  ];

  return (
    <>
      <Header links={links} />
      <Routes>
        <Route path="/" element={<Journal />} />
      </Routes>
    </>
  );
}

function UnsecureApp() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;
  if (!isAuthenticated) return <LoginScreen />;

  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={GLOBALS.AUTH0.DOMAIN}
      clientId={GLOBALS.AUTH0.CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: GLOBALS.AUTH0.AUDIENCE,
        scope: GLOBALS.AUTH0.SCOPE
      }}
    >
      <ThemeProvider value={theme}>
        <UnsecureApp />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
