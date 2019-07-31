import React, { useCallback, useEffect, useState } from 'react'
import { useAsyncFn } from '../lib/use-async-fn'
import { useNaturalRights } from './NaturalRights'
import { ErrorDisplay } from './ErrorDisplay'
import { DeviceSelect } from './DeviceSelect'

export function AuthorizeDeviceForm({ id: idProp = '', style }) {
  const { gun } = useNaturalRights()

  const [authorized, setAuthorized] = useState('')
  const [id, setId] = useState(idProp)

  const saveForm = useCallback(
    async evt => {
      evt.preventDefault()
      setAuthorized('')
      await gun.rights().authorizeDevice(id)
      setAuthorized(id)
    },
    [id, gun]
  )

  const [onSubmit, isWorking, error] = useAsyncFn(saveForm)

  useEffect(() => {
    setId(idProp)
  }, [idProp])

  if (isWorking) return <div>Authorizing device...</div>

  return (
    <form onSubmit={onSubmit} style={style}>
      {authorized && <div>Authorized: {authorized}</div>}
      {error && <ErrorDisplay error={error} />}
      {!idProp && <DeviceSelect id={id} onSelectId={setId} />}
      <button type='submit'>Authorize Device</button>
    </form>
  )
}
