// https://nextjs.org/docs/basic-features/data-fetching/client-side
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include'}).then(r => r.json())

export default function ProfileIndicator({onClick}) {
  const { data, error } = useSWR('https://apichessapp.server.ultras-playroom.xyz/login/identify.json', fetcher)

  if (error) return <>Signed in as: <Link href="/sign-in" onClick={onClick}>Nobody</Link></>
  else if (!data) return <>Loading...</>
  else if (!data.name) return <>Signed in as: <Link href="/sign-in" onClick={onClick}>Nobody</Link></>
  else return <>Signed in as: <Link href="/profile" onClick={onClick}>{data.name}</Link></>
}