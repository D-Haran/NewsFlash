import '../styles/globals.css'
import Navbar from '../components/navbar/navbar'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react';

import SEO from '../next-seo.config'

function MyApp({ Component, pageProps }) {
  return (
    <>
    <DefaultSeo {...SEO} />
      <Navbar />
      <Component {...pageProps} />
      <Analytics/>
    </>
  )
}

export default MyApp
