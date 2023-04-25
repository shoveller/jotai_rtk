import {useQueryClient} from "@tanstack/react-query";

import {atom, useAtom, useAtomValue} from 'jotai'
import {atomsWithQuery} from 'jotai-tanstack-query'
import {Suspense} from "react";
import './App.css'

const idAtom = atom(1)
// 첫번째는 비동기 아톰, 두번째는 동기 아톰이다.
// 상황에 따라 사용하면 된다.
// 비동기 아톰의 속도가 조금 더 빠르다
const [asyncAtom, syncAtom] = atomsWithQuery((get) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    return await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => res.json())
  },
}))

const ASyncUser = () => {
  // useAtom 을 사용하면 두번째 요소로 dispatch 함수를 준다.
  // 로우레벨 리프레시 액션을 직접 실행할 수 있다.
  const [data, dispatch] = useAtom(asyncAtom)

  return (
    <button onClick={() => dispatch({ type: 'refetch' })}>
      {data.name}
    </button>
  )
}

const SyncUser = () => {
  const { data, isLoading } = useAtomValue(syncAtom)
  // 전형적인 rtk 사용법
  const client = useQueryClient()

  if (isLoading) {
      return <>로딩중</>
  }

  return (
    <button onClick={() => client.invalidateQueries()}>
      {data.name}
    </button>
  )
}

function App() {
  return (
    <>
      <Suspense fallback="로딩중">
        <ASyncUser  />
      </Suspense>
      <SyncUser />
    </>
  )
}

export default App
