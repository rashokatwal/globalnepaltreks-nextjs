'use client';

import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon } from 'next-share';

const ShareButtons = ({ shareUrl }) => {
    return (
        <div className="flex gap-3">
              {/* <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  process.env.NEXT_PUBLIC_APP_URL + '/blogs/' + post.slug
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a> */}
              <FacebookShareButton
                url={shareUrl} >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              {/* <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  process.env.NEXT_PUBLIC_APP_URL + '/blogs/' + post.slug
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.05-4.55 4.55 0 .36.04.7.1 1.04-3.8-.2-7.17-2-9.42-4.78-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2.03 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.67-1.43 2.28-2.33z"/>
                </svg>
              </a> */}
              <LinkedinShareButton
                url={shareUrl} >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
    );
}

export default ShareButtons;