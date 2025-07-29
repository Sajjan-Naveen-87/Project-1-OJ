import React from 'react'
import FuzzyText from './FuzzyText';
const ComingSoon = () => {
  return (
      <div className="flex items-center justify-center h-screen">
                <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover={true}
                >
                    Coming Soon
                </FuzzyText>
            </div>
    );
}

export default ComingSoon