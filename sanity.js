import SanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = SanityClient({
  projectId: "qwoxusny",
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-10-21",
});

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export { urlFor, client };