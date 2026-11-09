import Script from "next/script";

type DatawrapperEmbedProps = {
  embedId: string,
  containerId: string
}

export default function DatawrapperEmbed({
  embedId,
  containerId
}: DatawrapperEmbedProps) {
  return (
    <div
      className="datawrapper"
      id={containerId}
      style={{ minHeight: 500, width: "100%" }}
    >
      <Script
        src={`https://datawrapper.dwcdn.net/${embedId}/embed.js`}
        strategy="afterInteractive"
        charSet="utf-8"
        data-target={`#${containerId}`}
      />

      <noscript>
        <img
          src={`https://datawrapper.dwcdn.net/${embedId}/full.png`}
          alt="Hanukkah List presidential race (Choropleth map)"
          style={{ width: "100%", height: "auto" }}
        />
      </noscript>
    </div>
  );
}