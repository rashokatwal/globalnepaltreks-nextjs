export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
  return {
    title: `${params.slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const ToursPage = ({params}) => {
    const tour = params.slug;
    return (
        <main>
            <h1>{tour}</h1>
        </main>
    )
}

export default ToursPage;