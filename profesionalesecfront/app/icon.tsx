import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  const logoData = readFileSync(join(process.cwd(), 'public', 'logo-icono.png'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '15%',
          overflow: 'hidden',
        }}
      >
        <img
          src={`data:image/png;base64,${logoData.toString('base64')}`}
          width="100%"
          height="100%"
          style={{ 
            width: '80%', 
            height: '80%', 
            objectFit: 'contain' 
          }}
        />
      </div>
    ),
    { ...size }
  )
}
