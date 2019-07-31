import { attachToGun } from 'natural-rights/es/natural-rights-client'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import Gun from 'gun'
import 'gun/sea'

export const NaturalRightsContext = createContext(null)
export const useNaturalRights = () => useContext(NaturalRightsContext)

export function useNaturalRightsProvider(Primitives, url) {
  if (Primitives) {
    attachToGun(Gun, Primitives, url)
  }

  const [openRequests, setOpenRequests] = useState(0)
  const isWorking = openRequests > 0

  const gun = useMemo(() => {
    if (!Primitives) {
      return null
    }
    const g = new Gun({
      peers: [`${window.location.origin}/gun`]
    })

    // tslint:disable-next-line: no-object-mutation
    Gun.gun = g
    return g
  }, [Primitives])

  const client = gun ? gun.rights().client : null

  async function trackRequest(fn) {
    setOpenRequests(reqCount => reqCount + 1)

    try {
      await fn()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e.stack || e)
    } finally {
      setOpenRequests(reqCount => reqCount - 1)
    }
  }

  const signup = useCallback(async () => trackRequest(() => gun.rights().signup()), [Primitives])

  const login = useCallback(
    ({ deviceCryptKeyPair, deviceSignKeyPair }) =>
      trackRequest(() => gun.rights().login(deviceCryptKeyPair, deviceSignKeyPair)),
    [gun]
  )

  const logout = useCallback(
    () =>
      trackRequest(async () => {
        await gun.rights().logout()
        if (location && location.reload) location.reload()
      }),
    [gun]
  )

  const value = {
    deviceId: client ? client.deviceId : '',
    gun,
    isWorking,
    login,
    logout,
    signup,
    userId: client ? client.userId : ''
  }

  return useMemo(() => value, Object.values(value))
}
