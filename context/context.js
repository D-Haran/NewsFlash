import { createContext, useState } from "react";

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    authReady: false
})
function Context({ children }) {
    const [user, setUser] = useState();
    const context = {user}
  
    return (
      <AuthContext.Provider value={{context}}>
        {children}
      </AuthContext.Provider>
    );
  }

  export default Context
