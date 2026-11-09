import Script from "next/script";

type PlotSetEmbedProps = {
  chartId: string;
  title?: string;
  aspect?: string;
  height?: number;
};

export default function PlotSetEmbed({
  chartId,
  title = "PlotSet chart",
  aspect = "0.511",
  height = 510,
}: PlotSetEmbedProps) {
  return (
    <>
      <iframe
        data-plotset-embed
        data-plotset-aspect={aspect}
        src={`https://plotset.com/api/embed/${chartId}`}
        title={title}
        width="100%"
        height={height}
        style={{
          border: 0,
          width: "100%",
        }}
        scrolling="no"
        allowFullScreen
        loading="lazy"
      />

      <Script
        src="https://plotset.com/api/assets/embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}