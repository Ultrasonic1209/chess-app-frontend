import dynamic from "next/dynamic"
import { Suspense } from "react";
import "swagger-ui-react/swagger-ui.css";
import Main from "../components/Main";

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    suspense: true
});

const fallback = <>
    <h2>Checkmate API</h2>
    <p>Swagger is currently loading, please wait...</p>
</>

export default function Docs() {
    return <Main title="API Docs">
        <Suspense fallback={fallback}>
            <SwaggerUI
                url="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json"
                displayRequestDuration={true}
                tryItOutEnabled={true}
            />
        </Suspense>
    </Main>
}