import React from 'react'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import AuthForm from './AuthForm'

const LoginLogoutForm = () => {
  return (
    <>
        <div className="relative z-10 flex items-center justify-center h-full px-4 py-15">
          <AnimatedContent
            distance={0}
            direction="vertical"
            reverse={false}
            duration={2.5}
            ease="bounce.out"
            initialOpacity={0}
            animateOpacity
            scale={3}
            threshold={0.3}
            delay={0.6}
          >
            <AuthForm />
          </AnimatedContent>
        </div>
    </>
  )
}

export default LoginLogoutForm