export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
  return {
    title: `${params.slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const PeakClimbingPage = ({params}) => {
    const peakClimbing = params.slug;
    return (
        <main>
            <h1>{peakClimbing}</h1>
        </main>
    )
}

export default PeakClimbingPage;