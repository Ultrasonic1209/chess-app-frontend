// https://nextjs.org/docs/basic-features/data-fetching/client-side
import Link from "next/link";
import useProfile from "../hooks/useProfile";
import { useOnlineStatus } from "../contexts/OnlineStatus";
import { memo } from "react";

export default memo(function ProfileIndicator({ onClick }) {
  const { user, error, loading, loggedOut } = useProfile();

  const isOnline = useOnlineStatus();

  if (!isOnline) return <>Offline</>;
  else if (error)
    return (
      <>
        Signed in as:{" "}
        <Link href="/sign-in" onClick={onClick}>
          Nobody
        </Link>
      </>
    );
  else if (loading) return <>Loading...</>;
  else if (loggedOut)
    return (
      <>
        Signed in as:{" "}
        <Link href="/sign-in" onClick={onClick}>
          Nobody
        </Link>
      </>
    );
  else
    return (
      <>
        Signed in as:{" "}
        <Link href="/profile" onClick={onClick}>
          {user.name}
        </Link>
      </>
    );
});
