"use client"
import React, { useEffect, useRef } from 'react';

interface Circle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}
interface BouncingCirclesProps {
  numberOfCircles?: number,
  constantSpeed?: number,
  baseCircleSize?:number,
  circleColor?: string,
  connectedLineColor?: string,
  connectedLineWidth?: number,
  connectedRadius?: number,
  maximumConnection?: number,
}
const defaultBouncingCirclesProps = {
  numberOfCircles: 50,
  constantSpeed: 0.5,
  circleColor: "rgba(210,208,220,0.5)",
  baseCircleSize: 1,
  connectedLineColor: "rgba(210,208,220,0.5)",
  connectedLineWidth: 1,
  connectedRadius: 100,
  maximumConnection: 3,
}
const BouncingCircles: React.FC<BouncingCirclesProps> = ({
  numberOfCircles = defaultBouncingCirclesProps.numberOfCircles,
  constantSpeed = defaultBouncingCirclesProps.constantSpeed,
  baseCircleSize = defaultBouncingCirclesProps.baseCircleSize,
  circleColor = defaultBouncingCirclesProps.circleColor,
  connectedLineColor = defaultBouncingCirclesProps.connectedLineColor,
  connectedLineWidth = defaultBouncingCirclesProps.connectedLineWidth,
  connectedRadius = defaultBouncingCirclesProps.connectedRadius,
  maximumConnection = defaultBouncingCirclesProps.maximumConnection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const devicePixelRatio = 1;
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = (canvas.parentElement)?.clientHeight ?
      canvas.parentElement.clientHeight
      : 400;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const circles = [] as Circle[]


      function createCircle(): Circle {
        // Random size between 1px and 5px
        const radius = Math.random() * (5 - 1) + baseCircleSize;

        // Random speed between 0.5 and 2.0 for smaller circles
        const speed = radius <= 3 ? Math.random() * (3 - 1) + 1 : Math.random() * (1.0 - 0.1) + 0.1;
        if (!canvas) return { x: 0, y: 0, radius, vx: 0, vy: 0 }
        return {
          x: Math.random() * (canvas.width - 2 * radius) + radius,
          y: Math.random() * (canvas.height - 2 * radius) + radius,
          radius: radius,
          vx: constantSpeed * (Math.random() > 0.5 ? 1 : -1) * speed,
          vy: constantSpeed * (Math.random() > 0.5 ? 1 : -1) * speed,
        };
      }

    function drawCircle(circle: Circle): void {
      // Draw circles with pastel blue fill color
      if (!ctx) return
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circleColor; // Pastel blue fill color
      ctx.fill();
      ctx.closePath();
    }

    function handleCollision(circle: Circle, otherCircle: Circle): void {
      const dx = otherCircle.x - circle.x;
      const dy = otherCircle.y - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const overlap = circle.radius + otherCircle.radius - distance;

      if (overlap > 0) {
        const collisionAngle = Math.atan2(dy, dx);

        // Move circles away from each other
        circle.x -= overlap / 2 * Math.cos(collisionAngle);
        circle.y -= overlap / 2 * Math.sin(collisionAngle);

        otherCircle.x += overlap / 2 * Math.cos(collisionAngle);
        otherCircle.y += overlap / 2 * Math.sin(collisionAngle);

        // Calculate new velocities
        const angle = Math.atan2(dy, dx);
        const speed1 = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
        const speed2 = Math.sqrt(otherCircle.vx * otherCircle.vx + otherCircle.vy * otherCircle.vy);

        const direction1 = Math.atan2(circle.vy, circle.vx);
        const direction2 = Math.atan2(otherCircle.vy, otherCircle.vx);

        const newVx1 = speed1 * Math.cos(direction1 - angle);
        const newVy1 = speed1 * Math.sin(direction1 - angle);
        const newVx2 = speed2 * Math.cos(direction2 - angle);
        const newVy2 = speed2 * Math.sin(direction2 - angle);

        // Apply elastic collision formula
        const finalVx1 = ((circle.radius - otherCircle.radius) * newVx1 + (2 * otherCircle.radius * newVx2)) / (circle.radius + otherCircle.radius);
        const finalVx2 = ((2 * circle.radius * newVx1) + (otherCircle.radius - circle.radius) * newVx2) / (circle.radius + otherCircle.radius);

        circle.vx = Math.cos(angle) * finalVx1 + Math.cos(angle + Math.PI / 2) * newVy1;
        circle.vy = Math.sin(angle) * finalVx1 + Math.sin(angle + Math.PI / 2) * newVy1;
        otherCircle.vx = Math.cos(angle) * finalVx2 + Math.cos(angle + Math.PI / 2) * newVy2;
        otherCircle.vy = Math.sin(angle) * finalVx2 + Math.sin(angle + Math.PI / 2) * newVy2;

        // If circles are still too close, move them away
        const correction = 0.5;
        circle.x -= correction * Math.cos(collisionAngle);
        circle.y -= correction * Math.sin(collisionAngle);
        otherCircle.x += correction * Math.cos(collisionAngle);
        otherCircle.y += correction * Math.sin(collisionAngle);
      }
    }

    function moveCircles(): void {
      circles.forEach(circle => {
        circle.x += circle.vx;
        circle.y += circle.vy;
        if (!canvas) return
        if (circle.x - circle.radius <= 0 || circle.x + circle.radius >= canvas.width) {
          circle.vx *= -1;
          // Ensure the circle stays within the canvas after reversing velocity
          circle.x = Math.max(circle.radius, Math.min(canvas.width - circle.radius, circle.x));
        }

        if (circle.y - circle.radius <= 0 || circle.y + circle.radius >= canvas.height) {
          circle.vy *= -1;
          // Ensure the circle stays within the canvas after reversing velocity
          circle.y = Math.max(circle.radius, Math.min(canvas.height - circle.radius, circle.y));
        }

        // Check for collisions with other circles
        circles.forEach(otherCircle => {
          if (circle !== otherCircle) {
            handleCollision(circle, otherCircle);
          }
        });

        // Prevent circles from getting stuck in corners
        if ((circle.vx > 0 && circle.vy > 0) || (circle.vx < 0 && circle.vy < 0)) {
          if (circle.x - circle.radius <= 0 && circle.y - circle.radius <= 0) {
            // Top-left corner
            circle.vx = Math.abs(circle.vx);
            circle.vy = Math.abs(circle.vy);
          } else if (circle.x + circle.radius >= canvas.width && circle.y - circle.radius <= 0) {
            // Top-right corner
            circle.vx = -Math.abs(circle.vx);
            circle.vy = Math.abs(circle.vy);
          } else if (circle.x - circle.radius <= 0 && circle.y + circle.radius >= canvas.height) {
            // Bottom-left corner
            circle.vx = Math.abs(circle.vx);
            circle.vy = -Math.abs(circle.vy);
          } else if (circle.x + circle.radius >= canvas.width && circle.y + circle.radius >= canvas.height) {
            // Bottom-right corner
            circle.vx = -Math.abs(circle.vx);
            circle.vy = -Math.abs(circle.vy);
          }
        }
      });
    }

    function drawConnectedLines(): void {
      if (!ctx) return
      ctx.beginPath();
      ctx.lineWidth = connectedLineWidth; // Set line width to 0.3px

      circles.forEach((circle, index) => {
        let connections = 0; // Counter for connections

        circles.forEach((otherCircle, otherIndex) => {
          if (index !== otherIndex && connections < maximumConnection) { // Limit the connections to 4
            const dx = otherCircle.x - circle.x;
            const dy = otherCircle.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectedRadius) {
              ctx.moveTo(circle.x, circle.y);
              ctx.lineTo(otherCircle.x, otherCircle.y);
              connections++;
            }
          }
        });
      });

      ctx.strokeStyle = connectedLineColor; // Line color
      ctx.stroke();
      ctx.closePath();
    }

    function animate(): void {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw dashed lines connecting each circle to the two circles ahead in the array

      // Draw circles
      circles.forEach(drawCircle);

      drawConnectedLines();
      moveCircles();
      requestAnimationFrame(animate);
    }

    // Initialize circles
    for (let i = 0; i < numberOfCircles; i++) {
      let overlap = true;

      while (overlap) {
        const circle = createCircle();
        overlap = circles.some(otherCircle => {
          const dx = circle.x - otherCircle.x;
          const dy = circle.y - otherCircle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < circle.radius + otherCircle.radius;
        });

        if (!overlap) {
          circles.push(circle);
        }
      }
    }

    animate();

  }, []);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      style={{
        backgroundColor: "#363345",
      }}
    ></canvas>
  );
};

export default BouncingCircles;