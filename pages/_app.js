import '../styles/globals.css'
import Context from "../context/context"
import Navbar from '../components/navbar/navbar'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react';

import SEO from '../next-seo.config'

function MyApp({ Component, pageProps }) {
  return (
    <Context>
    <DefaultSeo {...SEO} />
      <Navbar />
      <Component {...pageProps} />
      <Analytics/>
    </Context>
  )
}

export default MyApp
