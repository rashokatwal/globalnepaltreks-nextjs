'use client';

import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, InstapaperShareButton } from 'next-share';

const ShareButtons = ({ shareUrl }) => {
    return (
        <div className="flex gap-3">
              <FacebookShareButton
                url={shareUrl} >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareUrl} >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={shareUrl} >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <WhatsappShareButton
                url={shareUrl} >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
    );
}

export default ShareButtons;