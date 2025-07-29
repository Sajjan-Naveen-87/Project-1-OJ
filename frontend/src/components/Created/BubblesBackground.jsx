import React from 'react'
import Ballpit from '../Ballpit/Ballpit'

const BubblesBackground = () => {
  return (
    <>
        <div className="absolute inset-0 z-0">
          <Ballpit
            count={150}
            gravity={0.05}
            friction={0.99}
            wallBounce={1}
            followCursor={false}
            colors={[
              0xff3c38, // Red
              0xff8c42, // Orange
              0xf5e663, // Yellow
              0x53dd6c, // Green
              0x38a1db, // Blue
              0xa24fff, // Purple
              0xffffff, // White
            ]}
          />
        </div>
    </>
  )
}

export default BubblesBackground