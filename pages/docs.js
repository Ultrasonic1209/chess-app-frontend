import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {ssr: false});

export default function Docs() {
    return <SwaggerUI url="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json" />
}