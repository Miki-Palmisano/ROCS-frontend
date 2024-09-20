import { createContext } from 'react';

const defaultUserValue = {
  isLogged: false, setIsLogged: () => {},
  username: '', setUsername: () => {},
  logOut: () => {},
  id: 0, setId: () => {},
};

const UserContext = createContext(defaultUserValue);

export default UserContext;