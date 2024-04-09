import './App.css';
import React, { useEffect } from 'react';
import theme from './theme';
import { Button, DocumentIcon, LogOutIcon, PersonIcon, ThemeProvider, toaster } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';
import { store, AppDispatch } from './state/store';

import { Provider, useSelector, useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import ActiveItem from './components/ActiveItem';
import Navigator from './components/Navigator';

import { selectToken, selectUsername, setToken, setUsername } from './state/profile';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';

// Fragments
import TagManager, { TagManagerRef } from './fragments/TagManager/TagManagerRef';
import { useAPI } from './hooks';

function AuthenticatedApp() {
  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();
  const { getAccessTokenSilently, logout } = useAuth0();
  const token = useSelector(selectToken);
  const username = useSelector(selectUsername);
  const tagManagerRef = React.useRef<TagManagerRef>(null);

  useEffect(() => {
    getAccessTokenSilently().then((accessToken) => {
      dispatch(setToken(accessToken));
      // TODO: If project does not exist, handle it.

      fetch('https://dev-czejtnrwqf2cuw1e.uk.auth0.com/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then((response) => {
        response.json().then((data) => {
          console.log(data);
          dispatch(setUsername(data.email));
        });
      });
    });
  }, []);

  const handleSendReport = () => {
    api
      .generateReport()
      .then(() => {
        toaster.success('Report sent!');
      })
      .catch(() => {
        toaster.danger('Failed to send report');
      });
  };

  if (!token) return <LoadingScreen />;

  return (
    <Pane
      height="100vh"
      backgroundImage="url('mountain_background.png')"
      backgroundSize="cover"
      display="flex"
      flexDirection="column"
    >
      <Header
        links={[
          {
            name: 'Send Report',
            icon: DocumentIcon,
            onClick: () => handleSendReport()
          },
          {
            name: 'Account',
            icon: PersonIcon,
            onClick: () => null,
            subHeadings: [
              {
                name: username ?? 'Unknown',
                icon: PersonIcon,
                disabled: true,
                onClick: () => null
              },
              {
                name: 'Logout',
                icon: LogOutIcon,
                onClick: () => logout()
              }
            ]
          }
        ]}
      />

      <TagManager ref={tagManagerRef} />

      {/* Take background image from public/mountain_background.png */}
      <Pane className="App" width="100%" flex="1" display="flex">
        <Pane
          width="25%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          borderRadius={4}
          margin={16}
          marginRight={0}
        >
          <Navigator />
        </Pane>

        <Pane width="75%" display="flex" flexDirection="column" borderRadius={4} margin={16} flex="1">
          <ActiveItem />
        </Pane>
      </Pane>
    </Pane>
  );
}

const bgImage = `linear-gradient(45deg, rgba(57, 78, 92, 0.95), rgba(142, 189, 181, 0.47)), 
url('https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg')`;

function LoginScreen() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return null;

  if (!isAuthenticated) {
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

  return (
    <Provider store={store}>
      <AuthenticatedApp />
    </Provider>
  );
}

function App() {
  return (
    <Auth0Provider
      domain="dev-czejtnrwqf2cuw1e.uk.auth0.com"
      clientId="FrKaByHTyqxjP4AFIKqzeAw2dvzQdlJp"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'api.quanda.ai',
        scope: 'read:current_user update:current_user_metadata openid email'
      }}
    >
      <ThemeProvider value={theme}>
        <LoginScreen />
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
