import React from 'react';
interface BouncingCirclesProps {
    numberOfCircles?: number;
    constantSpeed?: number;
    baseCircleSize?: number;
    circleColor?: string;
    connectedLineColor?: string;
    connectedLineWidth?: number;
    connectedRadius?: number;
    maximumConnection?: number;
}
declare const BouncingCircles: React.FC<BouncingCirclesProps>;
export default BouncingCircles;
