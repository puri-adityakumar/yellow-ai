import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#EAB308',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial',
          }}
        >
          Y
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}