// https://swr.vercel.app/docs/getting-started
import useSWR from 'swr'

export const url = 'https://apichessapp.server.ultras-playroom.xyz/user/identify'

export const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())

export default function useProfile() {

  const { data, mutate, error } = useSWR(url, fetcher) // suspense when swr2 drops maybe

  const loading = (!data && !error) || typeof window === "undefined"
  const loggedOut = !(data?.name)

  return {
    loading,
    loggedOut,
    user: data,
    mutate
  };
}