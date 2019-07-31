import React from 'react'
import recryptApiToNaturalRights from 'natural-rights-recrypt'
import { Route, Switch } from 'react-router-dom'
import Homepage from './pages'
import { Doc } from './pages/Doc'
import { NaturalRightsProvider, AutoLogin, LoginForm } from './components/NaturalRights'
import { MyProfile } from './pages/MyProfile'

export function App() {
  return (
    <NaturalRightsProvider
      loadPrimitives={() =>
        import('@ironcorelabs/recrypt-wasm-binding').then(Recrypt =>
          recryptApiToNaturalRights(new Recrypt.Api256())
        )
      }
    >
      <AutoLogin LoginForm={LoginForm}>
        <Switch>
          <Route path='/' exact component={Homepage} />
          <Route path='/me' component={MyProfile} />
          <Route path='/doc/:documentId' exact component={Doc} />
        </Switch>
      </AutoLogin>
    </NaturalRightsProvider>
  )
}
