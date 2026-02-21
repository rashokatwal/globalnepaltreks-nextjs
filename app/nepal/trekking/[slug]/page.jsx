export async function generateMetadata({ params }) {
//   const heliTour = await getTrekBySlug(params.slug);
const { slug } = await params;
  return {
    title: `${slug} | Global Nepal Treks`,
    // description: trek.metaDescription,
  };
}

const TrekPage = async ({params}) => {
    const { slug } = await params;
    console.log(slug);
    return (
        <main>
            <h1>{slug}</h1>
        </main>
    )
}

export default TrekPage;