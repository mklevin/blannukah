import { AllAuthors } from "@/app/components/data/authors";

export default function Page() {
  return (
    <>
      <h1>Credits</h1>

      <div className="subtext">
        This level of shenaniganry would have been completely impossible
        to pull off alone. A huge shoutout to <b>Linda Liu</b> and
        <b> Patty Santa Cruz</b> for their incredible sticker designs,
        to <b>The New York Times</b> for their eminently imitatable
        election website, and to each and every one of our furry pundits
        and their owners!
      </div>

      <div className="credits-author-grid">
        {AllAuthors.map((author) => (
          <div key={author.name} className="credits-author">
            <img
              src={author.image}
              alt={author.name}
              className="credits-author-image"
            />

            <div className="credits-author-info">
              <p className="credits-author-name">{author.name}</p>
              <p className="credits-author-title">{author.jobTitle}</p>

              {author.credit && (
                <p className="credits-author-credit">
                  {author.credit}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}