import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  const fontResponse = await fetch(
    'https://raw.githubusercontent.com/google/fonts/main/ofl/manufacturingconsent/ManufacturingConsent-Regular.ttf'
  );

  if (!fontResponse.ok) {
    throw new Error('Failed to fetch Manufacturing Consent font');
  }

  const fontData = await fontResponse.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#fff',
          fontFamily: 'Manufacturing Consent',
          fontSize: 30,
        }}
      >
        B
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Manufacturing Consent',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}