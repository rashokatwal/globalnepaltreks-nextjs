export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
  return {
    title: `${params.slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const JungleSafariPage = ({params}) => {
    const jungleSafari = params.slug;
    return (
        <main>
            <h1>{jungleSafari}</h1>
        </main>
    )
}

export default JungleSafariPage;