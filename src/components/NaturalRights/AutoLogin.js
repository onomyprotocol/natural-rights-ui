import React, { useEffect, useCallback } from 'react'
import { useNaturalRights } from './hooks'

export function AutoLogin({ children, LoginForm: LoginFormComponent = () => 'Unable to login' }) {
  const { userId, gun, login, isWorking } = useNaturalRights()

  const attemptLogin = useCallback(async () => {
    if (userId || !gun) {
      return
    }

    const rights = gun.rights()
    const authStr = localStorage && localStorage.getItem('nrAuth')
    let auth = authStr && JSON.parse(authStr)

    if (!auth) {
      auth = {
        deviceCryptKeyPair: await rights.service.primitives.cryptKeyGen(),
        deviceSignKeyPair: await rights.service.primitives.signKeyGen()
      }
      if (localStorage) {
        localStorage.setItem('nrAuth', JSON.stringify(auth))
      }
    }

    await login(auth)
  }, [login])

  useEffect(() => {
    attemptLogin()
  }, [gun])

  if (isWorking) return <div>Logging in...</div>
  if (userId) return children
  return LoginFormComponent ? <LoginFormComponent /> : null
}
