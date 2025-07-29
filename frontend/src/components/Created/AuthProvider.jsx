import {useState, useContext, createContext} from 'react'

const AuthContext = createContext();


const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('accessToken') // if acess token present in the local storage then user is logged in
  )
  return (
    <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
       {children} {/*now this setIsLoggedIn will be available to all children components */}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export {AuthContext}; // AuthContext can be accessed by other components