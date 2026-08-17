import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SoftCV — Free live resume builder by Softora';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 52%, #14b8a6 100%)',
          padding: '72px 80px',
          color: '#ffffff',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, letterSpacing: 0.4, opacity: 0.9 }}>
          Softora
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            SoftCV
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              fontSize: 34,
              lineHeight: 1.35,
              maxWidth: 860,
              opacity: 0.95,
            }}
          >
            Live resume builder — preview while you write, export a pixel-perfect PDF.
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, opacity: 0.92 }}>
          Free · No login · ATS templates · softcv.softora.lk
        </div>
      </div>
    ),
    { ...size }
  );
}
