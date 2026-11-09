import DatawrapperEmbed from "@/app/embeds/datawrapper";

export default function Home() {
  return (
    <main>
      <div>Next.js on GitHub Pages</div>
      <DatawrapperEmbed/>
      <PlotSetEmbed
        chartId="5d9a0baa-a500-4421-8a50-a09dbc0ecaf2"
        title="Presidential race chart"
        aspect="0.511"
        height={510}
      />
    </main>
  );
}
