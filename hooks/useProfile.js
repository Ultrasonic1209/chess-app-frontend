// https://swr.vercel.app/docs/getting-started
import useSWR from 'swr'

export const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())

export default function useProfile() {
  const { data, error } = useSWR('https://apichessapp.server.ultras-playroom.xyz/login/identify', fetcher)

  return [ data, error ]
}