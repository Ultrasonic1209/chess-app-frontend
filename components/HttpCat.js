import Image from "next/future/image";

export default function HttpCat({statuscode}) {
    return <Image
      alt={`httpcat image (code ${statuscode})`}
      src={`https://http.cat/${statuscode}.jpg`}
      width={750}
      height={600}  
    />
} 
