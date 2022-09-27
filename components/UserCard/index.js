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

/*function gravatarLoader({src, width}) {

    return `https://www.gravatar.com/avatar/${src}?${params.toString()}`
}*/

const STATICIMGPARAMS = new URLSearchParams({
    default: "https://chessapp.ultras-playroom.xyz/maskable_icon.png",
    rating: "pg",
    size: 1024,
})

export default function UserCard({className, username, rank, avatarhash, priority}) {
    return (
        <div className={[styles.card, "p-1", "me-2", "bg-secondary", "text-white", "text-start", "rounded", "border", "border-light", className].join(' ')}>
            <Image
                className={styles.image}
                width={80}
                height={80}
                src={(
                    avatarhash
                    ? `https://www.gravatar.com/avatar/${avatarhash}?${STATICIMGPARAMS.toString()}`
                    : "https://chessapp.ultras-playroom.xyz/maskable_icon.png"
                    )}
                sizes={"25vw"}
                priority={priority}
                placeholder={"blur"}
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