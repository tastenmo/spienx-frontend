import React, { useEffect, useMemo, useState } from 'react';
import { documentService } from '../../../services/documentService';

export interface ImageProps {
  /** Relative asset path emitted by JSX translator, e.g. _images/logo.png */
  src: string;
  /** Image alternate text */
  alt?: string;
  /** Optional caption for figure-like rendering */
  caption?: string;
  /** Optional CSS className */
  className?: string;
  /** Optional width attribute */
  width?: string | number;
  /** Optional height attribute */
  height?: string | number;
  /** Current document id used for GetStaticAssetUrl lookup */
  documentId?: string;
}

const RESOLVED_URL_CACHE = new Map<string, string>();

function isResolvableRelativeAsset(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('http://') || src.startsWith('https://')) return false;
  if (src.startsWith('data:')) return false;
  if (src.startsWith('/')) return false;
  return true;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  width,
  height,
  documentId,
}) => {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  const docId = useMemo(() => {
    if (!documentId) return null;
    const parsed = Number(documentId);
    return Number.isFinite(parsed) ? parsed : null;
  }, [documentId]);

  useEffect(() => {
    let cancelled = false;

    const resolveSrc = async () => {
      setResolvedSrc(src);

      if (!docId || !isResolvableRelativeAsset(src)) {
        return;
      }

      const cacheKey = `${docId}:${src}`;
      const cachedUrl = RESOLVED_URL_CACHE.get(cacheKey);
      if (cachedUrl) {
        if (!cancelled) setResolvedSrc(cachedUrl);
        return;
      }

      try {
        const response = await documentService.getStaticAssetUrl(docId, src);
        const finalUrl = response.url || src;
        RESOLVED_URL_CACHE.set(cacheKey, finalUrl);
        if (!cancelled) {
          setResolvedSrc(finalUrl);
        }
      } catch (error) {
        console.warn('Failed to resolve static asset URL, using source path:', src, error);
      }
    };

    resolveSrc();

    return () => {
      cancelled = true;
    };
  }, [docId, src]);

  const containerClass = ['sphinx-image', className].filter(Boolean).join(' ');

  return (
    <figure className={containerClass}>
      <img src={resolvedSrc} alt={alt || caption || ''} width={width} height={height} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
};
