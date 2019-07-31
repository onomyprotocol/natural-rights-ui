import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNaturalRights } from './components/NaturalRights'

export function Header() {
  const { logout, gun } = useNaturalRights()
  const [name, setName] = useState('')

  useEffect(() => {
    gun
      .rights()
      .root()
      .get('profile')
      .get('name')
      .on(name => setName(name))
  }, [gun])

  return (
    <header>
      <Link to='/'>Natural Rights</Link>
      <Link to='/me' style={{ float: 'right' }}>
        Welcome {name} <button onClick={logout}>Logout</button>
      </Link>
      <hr />
    </header>
  )
}
