import React from 'react';

interface Props {
  url: string;
  width?: number | string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageView = ({ url, loading, alt, width }: Props) => {
  return <img src={url} loading={loading} alt={alt} width={width} />;
};
