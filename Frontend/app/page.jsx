import Image from 'next/image'
import Link from 'next/link'


export default function Home() {
  return (
    <main style={{padding:24, fontFamily:'Arial, sans-serif'}}>
      <h1>ClubIQ - Migrated to Next.js</h1>
      <p>This directory includes your original static site files under <code>/public</code>.</p>
      <p>Open <Link href="/index.html">index.html</Link> (if present) or integrate the files as components.</p>
    </main>
  )
}
