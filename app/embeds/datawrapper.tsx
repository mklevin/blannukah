import Script from "next/script";

export default function DatawrapperEmbed() {
  const embedId = "1T2G9";
  const containerId = `datawrapper-vis-${embedId}`;

  return (
    <div
      id={containerId}
      style={{ minHeight: 441, width: "100%" }}
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