import React from 'react'
import BubblesBackground from '../BubblesBackground'
import LoginLogoutForm from '../LoginAndSigninForm'

const HomePageToRegisterOrLogin = () => {
  { localStorage.clear()}
  return (
    <>
        <div className="relative w-full min-h-screen pt-20 overflow-hidden">
            <BubblesBackground/>
            <LoginLogoutForm/>
        </div>
    </>
  )
}

export default HomePageToRegisterOrLogin