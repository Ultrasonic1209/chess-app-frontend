import dynamic from "next/dynamic"
import Head from "next/head";
import Main from "../components/Main";

import "swagger-ui-react/swagger-ui.css";

const fallback = () => <>
    <h2>Checkmate API</h2>
    <p>Swagger is currently loading, please wait...</p>
</>

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    loading: fallback
});

export default function Docs() {
    return <>
        <Head>
            <link
                rel="preload"
                href="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json"
                as="fetch"
                type="application/json"
                crossOrigin="with-credentials"
            />
            <style dangerouslySetInnerHTML={{__html:"@media (prefers-color-scheme:dark){.swagger-ui{filter:invert(88%) hue-rotate(180deg)}.swagger-ui .highlight-code{filter:invert(100%) hue-rotate(180deg)}}"}}/>
        </Head>
        <Main title="Docs">
            <SwaggerUI
                url="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json"
                displayRequestDuration={true}
                tryItOutEnabled={false}
            />
        </Main>
    </>
}