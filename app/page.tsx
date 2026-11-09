import Script from 'next/script'

export default function Home() {
  return (
    <main>
      <div>Next.js on GitHub Pages</div>
      <div><Script src="embeds/presidential.js" /></div>
    </main>
  );
}
