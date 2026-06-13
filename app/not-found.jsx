// app/not-found.tsx

import NotFoundClient from "./(main)/NotFoundClient";


// Keeping this file a Server Component forces Next.js to issue a native 404 status code header
export default function NotFound() {
  return <NotFoundClient />;
}