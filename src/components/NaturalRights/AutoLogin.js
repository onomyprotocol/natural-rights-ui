import React, { useEffect } from 'react'
import { useNaturalRights } from './hooks'

export function AutoLogin({ children, LoginForm: LoginFormComponent = () => 'Unable to login' }) {
  const { userId, gun, login, signup, isWorking } = useNaturalRights()

  useEffect(() => {
    (async () => {
      if (userId || !gun) {
        return
      }

      const authStr = localStorage && localStorage.getItem('nrAuth')
      let auth = authStr && JSON.parse(authStr)

      if (auth) {
        return login(auth)
      }

      if (!userId) {
        await signup()
        const { client } = gun.rights()
        auth = {
          deviceCryptKeyPair: client.deviceCryptKeyPair,
          deviceSignKeyPair: client.deviceSignKeyPair,
          userId: client.userId
        }
        if (localStorage) {
          localStorage.setItem('nrAuth', JSON.stringify(auth))
        }
      }
    })()
  }, [gun])

  if (isWorking) {
    return <div>Logging in...</div>
  }

  if (userId) {
    return children
  }

  return LoginFormComponent ? <LoginFormComponent /> : null
}
