'use client';

import { FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, InstapaperShareButton, EmailShareButton, EmailIcon, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, PinterestShareButton, PinterestIcon, PinterestShareCount, FacebookShareCount } from 'next-share';

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
              <RedditShareButton
                url={shareUrl} >
                <RedditIcon size={32} round />
              </RedditShareButton>
              <TelegramShareButton
                url={shareUrl} >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <PinterestShareButton
                url={shareUrl} >
                <PinterestIcon size={32} round />
              </PinterestShareButton>
              <EmailShareButton
                url={shareUrl} >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
    );
}

export default ShareButtons;