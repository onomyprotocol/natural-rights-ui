import React, { useEffect, useState } from 'react'
import { NaturalRightsContext, useNaturalRightsProvider } from './hooks'

export function NaturalRightsProvider({
  children,
  loadPrimitives,
  // eslint-disable-next-line react/no-multi-comp
  Loading = () => <div>Loading...</div>,
  url = '/api/v1'
}) {
  const [primitives, setPrimitives] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        setPrimitives(await loadPrimitives())
      } catch (e) {
        setError(e)
      }
    })()
  }, [])

  const value = useNaturalRightsProvider(primitives, url)

  if (error) {
    return (
      <div>
        <h3>Error Loading Natural Rights</h3>
        <pre>{`${error.stack || error}`}</pre>
      </div>
    )
  }

  return (
    <NaturalRightsContext.Provider value={value}>
      {primitives ? children : <Loading />}
    </NaturalRightsContext.Provider>
  )
}
