export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
  return {
    title: `${params.slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const HeliTourPage = ({params}) => {
    const heliTour = params.slug;
    return (
        <main>
            <h1>{heliTour}</h1>
        </main>
    )
}

export default HeliTourPage;