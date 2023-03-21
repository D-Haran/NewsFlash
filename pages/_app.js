import '../styles/globals.css'
import Context from "../context/context"
import Navbar from '../components/navbar/navbar'

function MyApp({ Component, pageProps }) {
  return (
    <Context>
      <Navbar />
      <Component {...pageProps} />
    </Context>
  )
}

export default MyApp
