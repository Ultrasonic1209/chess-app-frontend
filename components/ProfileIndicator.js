// https://nextjs.org/docs/basic-features/data-fetching/client-side
import Link from 'next/link'
import useProfile from '../hooks/useProfile'

export default function ProfileIndicator({onClick}) {
  const [ data, error ] = useProfile()

  if (error) return <>Signed in as: <Link href="/sign-in" onClick={onClick}>Nobody</Link></>
  else if (!data) return <>Loading...</>
  else if (!data.name) return <>Signed in as: <Link href="/sign-in" onClick={onClick}>Nobody</Link></>
  else return <>Signed in as: <Link href="/profile" onClick={onClick}>{data.name}</Link></>
}