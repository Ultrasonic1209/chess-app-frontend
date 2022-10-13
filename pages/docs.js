import dynamic from "next/dynamic"
import Head from "next/head";
import "swagger-ui-react/swagger-ui.css";
import Main from "../components/Main";

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
            <link rel="preload" href="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json" as="fetch" />
        </Head>
        <Main title="Docs">
            <SwaggerUI
                url="https://apichessapp.server.ultras-playroom.xyz/docs/openapi.json"
                displayRequestDuration={true}
                tryItOutEnabled={true}
            />
        </Main>
    </>
}