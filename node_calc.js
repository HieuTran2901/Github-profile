const anchors = {
  react: { x: 1210, y: 475 },
  ts: { x: 930, y: 760 },
  docker: { x: 720, y: 760 },
  aws: { x: 500, y: 640 },
  redis: { x: 450, y: 460 },
  java: { x: 650, y: 250 },
  spring: { x: 880, y: 180 },
  rabbitmq: { x: 1135, y: 245 },
  mysql: { x: 1125, y: 690 },
};

// Try center X = 1175, Y = 490
let cx = 1175;
let cy = 490;

let sumR = 0;
let radii = [];
for (const [key, pt] of Object.entries(anchors)) {
  const dx = pt.x - cx;
  const dy = pt.y - cy;
  const r = Math.sqrt(dx*dx + dy*dy);
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  sumR += r;
  radii.push(r);
  console.log(`${key}: R=${r.toFixed(1)}, Angle=${ang.toFixed(1)}`);
}
console.log("Average R:", sumR / Object.keys(anchors).length);

// Try center X = 1152, Y = 540
console.log("\nCenter 1152, 540:");
cx = 1152;
cy = 540;
sumR = 0;
radii = [];
for (const [key, pt] of Object.entries(anchors)) {
  const dx = pt.x - cx;
  const dy = pt.y - cy;
  const r = Math.sqrt(dx*dx + dy*dy);
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  sumR += r;
  radii.push(r);
  console.log(`${key}: R=${r.toFixed(1)}, Angle=${ang.toFixed(1)}`);
}
console.log("Average R:", sumR / Object.keys(anchors).length);

