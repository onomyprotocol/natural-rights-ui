import React from 'react'

export function ErrorDisplay({ error }) {
  const title = `${error}`
  const details = error.stack || JSON.stringify(error)

  return (
    <div className='error'>
      Error: {title}
      <pre>{details}</pre>
    </div>
  )
}
