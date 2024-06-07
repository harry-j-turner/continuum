/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer } from 'react';

// Services
import APIService from './Services/API';

// Types
import { Group } from './Services/API/types';

type AuthState = {
  isLoaded: boolean;
  user: string | null;
  sub: string | null;
  email: string | null;
  password: string | null;
  bearerToken: string | null;
  group: Group;
};

type AuthAction = {
  type: 'UPDATE';
  payload: Partial<AuthState>;
};

const initialState: AuthState = {
  isLoaded: false,
  user: null,
  sub: null,
  email: null,
  password: null,
  bearerToken: null,
  group: 'client'
};

const AuthContext = createContext<AuthState>(initialState);
const AuthDispatchContext = createContext<null | React.Dispatch<AuthAction>>(null);

const useAuth = () => useContext(AuthContext);
const useAuthDispatch = () => useContext(AuthDispatchContext)!;

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem('email').then((storedEmail) => {
      dispatch({
        type: 'UPDATE',
        payload: { isLoaded: true, email: storedEmail }
      });
    });
  }, []);

  useEffect(() => {
    if (state.bearerToken) {
      const apiService = APIService.getInstance();
      apiService.setToken(state.bearerToken);
    }
  }, [state.bearerToken]);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { useAuth, useAuthDispatch };
