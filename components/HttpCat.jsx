import Image from "next/image";
import { memo } from "react";

export default memo(function HttpCat({statuscode}) {
    const css = { maxWidth: '100%', height: 'auto' }
    return <Image
      alt={`httpcat image (code ${statuscode})`}
      src={`https://http.cat/${statuscode}.jpg`}
      width={750}
      height={600}
      style={css}
    />
})
