"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var defaultBouncingCirclesProps = {
    numberOfCircles: 50,
    constantSpeed: 0.5,
    circleColor: "rgba(210,208,220,0.5)",
    baseCircleSize: 1,
    connectedLineColor: "rgba(210,208,220,0.5)",
    connectedLineWidth: 1,
    connectedRadius: 100,
    maximumConnection: 3,
};
var BouncingCircles = function (_a) {
    var _b = _a.numberOfCircles, numberOfCircles = _b === void 0 ? defaultBouncingCirclesProps.numberOfCircles : _b, _c = _a.constantSpeed, constantSpeed = _c === void 0 ? defaultBouncingCirclesProps.constantSpeed : _c, _d = _a.baseCircleSize, baseCircleSize = _d === void 0 ? defaultBouncingCirclesProps.baseCircleSize : _d, _e = _a.circleColor, circleColor = _e === void 0 ? defaultBouncingCirclesProps.circleColor : _e, _f = _a.connectedLineColor, connectedLineColor = _f === void 0 ? defaultBouncingCirclesProps.connectedLineColor : _f, _g = _a.connectedLineWidth, connectedLineWidth = _g === void 0 ? defaultBouncingCirclesProps.connectedLineWidth : _g, _h = _a.connectedRadius, connectedRadius = _h === void 0 ? defaultBouncingCirclesProps.connectedRadius : _h, _j = _a.maximumConnection, maximumConnection = _j === void 0 ? defaultBouncingCirclesProps.maximumConnection : _j;
    var canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var devicePixelRatio = 1;
        canvas.width = ((_a = canvas.parentElement) === null || _a === void 0 ? void 0 : _a.clientWidth) || window.innerWidth;
        canvas.height = ((_b = (canvas.parentElement)) === null || _b === void 0 ? void 0 : _b.clientHeight) ?
            canvas.parentElement.clientHeight
            : 400;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        var circles = [];
        function createCircle() {
            // Random size between 1px and 5px
            var radius = Math.random() * (5 - 1) + baseCircleSize;
            // Random speed between 0.5 and 2.0 for smaller circles
            var speed = radius <= 3 ? Math.random() * (3 - 1) + 1 : Math.random() * (1.0 - 0.1) + 0.1;
            if (!canvas)
                return { x: 0, y: 0, radius: radius, vx: 0, vy: 0 };
            return {
                x: Math.random() * (canvas.width - 2 * radius) + radius,
                y: Math.random() * (canvas.height - 2 * radius) + radius,
                radius: radius,
                vx: constantSpeed * (Math.random() > 0.5 ? 1 : -1) * speed,
                vy: constantSpeed * (Math.random() > 0.5 ? 1 : -1) * speed,
            };
        }
        function drawCircle(circle) {
            // Draw circles with pastel blue fill color
            if (!ctx)
                return;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            ctx.fillStyle = circleColor; // Pastel blue fill color
            ctx.fill();
            ctx.closePath();
        }
        function handleCollision(circle, otherCircle) {
            var dx = otherCircle.x - circle.x;
            var dy = otherCircle.y - circle.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var overlap = circle.radius + otherCircle.radius - distance;
            if (overlap > 0) {
                var collisionAngle = Math.atan2(dy, dx);
                // Move circles away from each other
                circle.x -= overlap / 2 * Math.cos(collisionAngle);
                circle.y -= overlap / 2 * Math.sin(collisionAngle);
                otherCircle.x += overlap / 2 * Math.cos(collisionAngle);
                otherCircle.y += overlap / 2 * Math.sin(collisionAngle);
                // Calculate new velocities
                var angle = Math.atan2(dy, dx);
                var speed1 = Math.sqrt(circle.vx * circle.vx + circle.vy * circle.vy);
                var speed2 = Math.sqrt(otherCircle.vx * otherCircle.vx + otherCircle.vy * otherCircle.vy);
                var direction1 = Math.atan2(circle.vy, circle.vx);
                var direction2 = Math.atan2(otherCircle.vy, otherCircle.vx);
                var newVx1 = speed1 * Math.cos(direction1 - angle);
                var newVy1 = speed1 * Math.sin(direction1 - angle);
                var newVx2 = speed2 * Math.cos(direction2 - angle);
                var newVy2 = speed2 * Math.sin(direction2 - angle);
                // Apply elastic collision formula
                var finalVx1 = ((circle.radius - otherCircle.radius) * newVx1 + (2 * otherCircle.radius * newVx2)) / (circle.radius + otherCircle.radius);
                var finalVx2 = ((2 * circle.radius * newVx1) + (otherCircle.radius - circle.radius) * newVx2) / (circle.radius + otherCircle.radius);
                circle.vx = Math.cos(angle) * finalVx1 + Math.cos(angle + Math.PI / 2) * newVy1;
                circle.vy = Math.sin(angle) * finalVx1 + Math.sin(angle + Math.PI / 2) * newVy1;
                otherCircle.vx = Math.cos(angle) * finalVx2 + Math.cos(angle + Math.PI / 2) * newVy2;
                otherCircle.vy = Math.sin(angle) * finalVx2 + Math.sin(angle + Math.PI / 2) * newVy2;
                // If circles are still too close, move them away
                var correction = 0.5;
                circle.x -= correction * Math.cos(collisionAngle);
                circle.y -= correction * Math.sin(collisionAngle);
                otherCircle.x += correction * Math.cos(collisionAngle);
                otherCircle.y += correction * Math.sin(collisionAngle);
            }
        }
        function moveCircles() {
            circles.forEach(function (circle) {
                circle.x += circle.vx;
                circle.y += circle.vy;
                if (!canvas)
                    return;
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
                circles.forEach(function (otherCircle) {
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
                    }
                    else if (circle.x + circle.radius >= canvas.width && circle.y - circle.radius <= 0) {
                        // Top-right corner
                        circle.vx = -Math.abs(circle.vx);
                        circle.vy = Math.abs(circle.vy);
                    }
                    else if (circle.x - circle.radius <= 0 && circle.y + circle.radius >= canvas.height) {
                        // Bottom-left corner
                        circle.vx = Math.abs(circle.vx);
                        circle.vy = -Math.abs(circle.vy);
                    }
                    else if (circle.x + circle.radius >= canvas.width && circle.y + circle.radius >= canvas.height) {
                        // Bottom-right corner
                        circle.vx = -Math.abs(circle.vx);
                        circle.vy = -Math.abs(circle.vy);
                    }
                }
            });
        }
        function drawConnectedLines() {
            if (!ctx)
                return;
            ctx.beginPath();
            ctx.lineWidth = connectedLineWidth; // Set line width to 0.3px
            circles.forEach(function (circle, index) {
                var connections = 0; // Counter for connections
                circles.forEach(function (otherCircle, otherIndex) {
                    if (index !== otherIndex && connections < maximumConnection) { // Limit the connections to 4
                        var dx = otherCircle.x - circle.x;
                        var dy = otherCircle.y - circle.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
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
        function animate() {
            if (!ctx || !canvas)
                return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw dashed lines connecting each circle to the two circles ahead in the array
            // Draw circles
            circles.forEach(drawCircle);
            drawConnectedLines();
            moveCircles();
            requestAnimationFrame(animate);
        }
        // Initialize circles
        for (var i = 0; i < numberOfCircles; i++) {
            var overlap = true;
            var _loop_1 = function () {
                var circle = createCircle();
                overlap = circles.some(function (otherCircle) {
                    var dx = circle.x - otherCircle.x;
                    var dy = circle.y - otherCircle.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    return distance < circle.radius + otherCircle.radius;
                });
                if (!overlap) {
                    circles.push(circle);
                }
            };
            while (overlap) {
                _loop_1();
            }
        }
        animate();
    }, []);
    return (react_1.default.createElement("canvas", { id: "canvas", ref: canvasRef, style: {
            backgroundColor: "#363345",
        } }));
};
exports.default = BouncingCircles;
