# t-bouncing-circles

Enhance your website's visual appeal with 't-bouncing-circles.' This React component allows you to effortlessly integrate captivating animated bouncing circles, making it ideal for dynamic banners, interactive backgrounds, and engaging user interfaces.

## Installation

Install the package using npm:

```bash
npm install t-bouncing-circles

```

## Properties
You can customize the appearance and behavior of the bouncing circles by providing custom props. Here are the customizable properties:

- `numberOfCircles` (number, default: 50): Number of bouncing circles.
- `constantSpeed` (number, default: 0.5): Constant speed of the circles.
- `circleColor` (string, default: "rgba(210,208,220,0.5)"): Color of the circles.
- `connectedLineColor` (string, default: "rgba(210,208,220,0.5)"): Color of the lines connecting circles.
- `connectedLineWidth` (number, default: 1): Width of the lines connecting circles.
- `connectedRadius` (number, default: 100): Radius within which circles are connected.
- `maximumConnection` (number, default: 3): Maximum number of connections for each circle.
- `width` (number): Width of the canvas (px) if undifined they will equal to width of their parent.
- `height` (number): Height of the canvas (px) if undifined they will equal to height of their parent.


## Basic Usage

Simply import the `BouncingCircles` component and include it in your React component:

```jsx
import React from 'react';
import BouncingCircles from 't-bouncing-circles';

const YourComponent = () => {
  return (
    <div>
      {/* Your other components */}
      <BouncingCircles 
        width={800}
        height={800}
        numberOfCircles={50}
        constantSpeed={0.5}
        circleColor="rgba(210,208,220,0.5)"
        connectedLineColor="rgba(210,208,220,0.5)"
        connectedLineWidth={1}
        connectedRadius={100}
        maximumConnection={3}
      />
    </div>
  );
};

export default YourComponent;

```
