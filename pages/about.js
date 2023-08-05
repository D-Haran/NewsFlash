import Head from "next/head"
import styles from '../styles/about.module.css'

const About = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>About | NewsFlash</title>
        <meta name="description" content="About NewsFlash" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          About NewsFlash
        </h1>

        <p className={styles.description}>
        NewsFlash is a software solution that we&#39;ve designed to bridge the communication gap in schools. Think of it as your virtual bulletin board where clubs and event organizers can post their daily schedules. It&#39;s a simple, yet effective way to keep everyone in the loop.
        <br />
        We&#39;ve noticed that students often miss out on morning PA announcements, and that&#39;s where NewsFlash comes in. If you didn&#39;t catch the morning announcements, no worries! Just hop onto NewsFlash and you&#39;ll find all the updates you need. It&#39;s all about making information accessible and easy to find.
        <br />
        But NewsFlash isn&#39;t just about making announcements more accessible. It&#39;s also about boosting participation. By making it easier for students to find out about club meetings and school events, we&#39;re hoping to see more students getting involved. After all, a vibrant and active school community is what makes school memorable.
        <br />
        So, whether you&#39;re a club leader wanting to reach more students, or a student who doesn&#39;t want to miss out on the latest happenings, NewsFlash is here to keep you connected.
        </p>

        <div className={styles.grid}>
        </div>
      </main>

      <footer className={styles.footer}>
          Powered by
          <p className={styles.logo}>
            NewsFlash
          </p>
      </footer>
    </div>
  )
}

export default About