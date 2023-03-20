import '../styles/globals.css'
import Context from "../context/context"
import Navbar from '../components/navbar/navbar'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <Context>
    <Head>
        <link rel="shortcut icon" href="static/LogoOrangeSlim.svg" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </Context>
  )
}

export default MyApp
