export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
  return {
    title: `${params.slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const RaftingPage = ({params}) => {
    const rafting = params.slug;
    return (
        <main>
            <h1>{rafting}</h1>
        </main>
    )
}

export default RaftingPage;