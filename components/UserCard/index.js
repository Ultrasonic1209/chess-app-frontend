import Image from "next/future/image";

import styles from './UserCard.module.css'

const RANKS = {
    0: "Pawn",
    400: "Knight",
    600: "Rook",
    1000: "Bishop",
    1400: "Queen",
    2000: "King"
}

function getRank(rank) {
    let response = "Error";

    Object.entries(RANKS).forEach(([threshold, name]) => {
        if (rank >= parseInt(threshold)) {
            response = name
        }
    })

    return response
}

function gravatarLoader({src, width}) {
    const params = new URLSearchParams({
        d: "https://chessapp.ultras-playroom.xyz/maskable_icon.png",
        r: "pg",
        s: width
    })
    return `https://www.gravatar.com/avatar/${src}?${params.toString()}`
}

export default function UserCard({className, username, rank, avatarhash, priority}) {
    return (
        <div className={[styles.card, "p-1", "me-2", "bg-secondary", "text-white", "text-start", "rounded", "border", "border-light", className].join(' ')}>
            <Image
                className={styles.image}
                width={80}
                height={80}
                src={avatarhash || "nosrc"}
                loader={gravatarLoader}
                sizes={"10vw"}
                priority={priority}
                alt={`${username}'s profile picture.`}
            />
            <div className={[styles.info, "ms-5", "ps-3"].join(' ')}>
                <center><b>{username}</b></center>
                {
                    rank
                    ? <>
                        Score: {rank}
                        <br/>
                        {getRank(rank)}
                    </>
                    : undefined
                }
            </div>
        </div>
    )
}