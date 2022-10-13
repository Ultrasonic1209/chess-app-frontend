import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css";
import Main from "../components/Main";

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {ssr: false});

export default function Docs() {
    return <Main title="API Docs">
        <SwaggerUI url="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json" />
    </Main>
}