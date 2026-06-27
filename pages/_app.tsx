import { AppProps } from "next/app";
import Head from "next/head";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/argon-design-system-react.css";
import "../styles/styles.css";
import "../styles/vendor/font-awesome/css/font-awesome.min.css";
import "../styles/vendor/nucleo/css/nucleo.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="XJBBUDtDebx06rVkc1jkqmhCN0uPEuELkt9XnZmIlKY"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
