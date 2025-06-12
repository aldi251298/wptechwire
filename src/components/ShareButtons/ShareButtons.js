// src/components/ShareButtons/ShareButtons.js

import { useState } from 'react';
import styles from './ShareButtons.module.css';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaPinterestP, 
  FaTumblr, 
  FaVk, 
  FaLink,
  FaFlipboard
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { SiBluesky } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // Daftar platform, Scoop.it sudah dihapus
  const socialPlatforms = [
    { name: 'Facebook', icon: <FaFacebookF />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, className: styles.facebook },
    { name: 'Twitter', icon: <FaTwitter />, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, className: styles.twitter },
    { name: 'LinkedIn', icon: <FaLinkedinIn />, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, className: styles.linkedin },
    { name: 'Pinterest', icon: <FaPinterestP />, url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`, className: styles.pinterest },
    { name: 'Threads', icon: <FaThreads />, url: `https://www.threads.net/share?url=${encodedUrl}&text=${encodedTitle}`, className: styles.threads },
    { name: 'Tumblr', icon: <FaTumblr />, url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedUrl}&title=${encodedTitle}`, className: styles.tumblr },
    { name: 'VK', icon: <FaVk />, url: `https://vk.com/share.php?url=${encodedUrl}`, className: styles.vk },
    { name: 'Bluesky', icon: <SiBluesky />, url: `https://bsky.app/intent/compose?text=${encodedTitle}%0A%0A${encodedUrl}`, className: styles.bluesky },
    { name: 'Flipboard', icon: <FaFlipboard />, url: `https://share.flipboard.com/bookmarklet/popout?v=2&title=${encodedTitle}&url=${encodedUrl}`, className: styles.flipboard },
    { name: 'Email', icon: <MdEmail />, url: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`, className: styles.email },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.shareContainer}>
      <h3 className={styles.shareTitle}>SHARE THIS POST</h3>
      <div className={styles.buttonsGrid}>
        {socialPlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.shareButton} ${platform.className}`}
            aria-label={`Share on ${platform.name}`}
          >
            {platform.icon}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className={`${styles.shareButton} ${styles.copyLink} ${copied ? styles.copied : ''}`}
          aria-label="Copy link"
        >
          <FaLink />
        </button>
      </div>
      {copied && <p className={styles.copyFeedback}>Link Copied!</p>}
    </div>
  );
}