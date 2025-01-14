import SocialMediaLinks from "./socials";

export default function BlogHeader() {
  return (
    <>
      <section className="flex flex-col gap-6 px-10 md:px-14  pb-6 pt-2">
        <div className="space-y-1 not-prose">
          <p className="uppercase text-neutral-500 font-medium text-xs"> Press Release </p>
          <p className="uppercase text-neutral-500 font-medium  text-xs"> {new Date().toDateString()} </p>
        </div>

        <div className="">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">
            Apple Music expands live global radio offering with three brand-new stations{" "}
          </h1>
        </div>

        <div className="font-semibold text-lg mb-0">
          <p>
            The new Apple Música Uno, Apple Music Club, and Apple Music Chill live-hosted radio stations offer listeners more exclusive shows from
            some of the world’s most vital artists, including Becky G, Rauw Alejandro, Grupo Frontera, Honey Dijon, Jamie xx, FKA twigs, Nia Archives,
            Brian Eno, Stephan Moccio, and more
          </p>
        </div>

        <SocialMediaLinks />
      </section>
    </>
  );
}
