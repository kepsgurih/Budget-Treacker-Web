import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import Routing from './routing.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

import moment from "moment";

moment.locale("id");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
