import React from 'react'
import recryptApiToNaturalRights from 'natural-rights-recrypt'
import { Route, Switch } from 'react-router-dom'
import { NaturalRightsProvider } from './components/NaturalRights'
import Homepage from './pages'
import { Doc } from './pages/Doc'

export function App() {
  return (
    <NaturalRightsProvider
      loadPrimitives={() =>
        import('@ironcorelabs/recrypt-wasm-binding').then(Recrypt =>
          recryptApiToNaturalRights(new Recrypt.Api256())
        )
      }
    >
      <Switch>
        <Route path='/' exact component={Homepage} />
        <Route path='/doc/:documentId' exact component={Doc} />
      </Switch>
    </NaturalRightsProvider>
  )
}
