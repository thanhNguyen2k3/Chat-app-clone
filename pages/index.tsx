import Head from 'next/head'
import { Inter } from 'next/font/google'
import Sidebar from '../components/Sidebar'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat App 4.0</title>
        <meta name="description" content="Chat-app create by Thanh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar/>
    </>
  )
}
