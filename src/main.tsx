import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createStore, Provider} from "jotai";
import {DevTools} from "jotai-devtools/index";
import {queryClientAtom} from "jotai-tanstack-query";
import {useHydrateAtoms} from "jotai/utils";
import {FC, PropsWithChildren, StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const store = createStore()
const queryClient = new QueryClient();

// 쿼리 클라이언트를 아톰에 저장한다
const HydrateAtom:FC<PropsWithChildren> = ({ children }) => {
  useHydrateAtoms([
    [queryClientAtom, queryClient]
  ])

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DevTools store={store} />
        <HydrateAtom>
          <App />
        </HydrateAtom>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
