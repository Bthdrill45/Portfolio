/* ── 3D GLOBE CANVAS ── */
(function initGlobe() {

  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const W = canvas.width;
  const H = canvas.height;

  const cx = W / 2;
  const cy = H / 2;

  const R = 155;

  let angle = 0;

  // CLICK DOTS
  let clickDots = [];

  // Add click effect
  canvas.addEventListener('click', (e) => {

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only inside globe
    const dx = x - cx;
    const dy = y - cy;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= R) {

      clickDots.push({
        x,
        y,
        alpha: 1,
        size: 2
      });

    }

  });

  // Convert lat/lon to xyz
  function latLonToXYZ(lat, lon, r) {

    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return {
      x: -r * Math.sin(phi) * Math.cos(theta),
      y:  r * Math.cos(phi),
      z:  r * Math.sin(phi) * Math.sin(theta)
    };

  }

  const cities = [

    { lat: 19.07,  lon: 72.87,  name: 'Mumbai' },
    { lat: 51.5,   lon: -0.12,  name: 'London' },
    { lat: 40.71,  lon: -74.01, name: 'New York' },
    { lat: 35.68,  lon: 139.69, name: 'Tokyo' },
    { lat: 37.77,  lon: -122.4, name: 'SF' },
    { lat: -33.86, lon: 151.2,  name: 'Sydney' },
    { lat: 48.85,  lon: 2.35,   name: 'Paris' },
    { lat: 55.75,  lon: 37.61,  name: 'Moscow' },
    { lat: 1.35,   lon: 103.82, name: 'Singapore' },
    { lat: 25.2,   lon: 55.27,  name: 'Dubai' },

  ];

  const arcs = [

    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 9 },
    { from: 2, to: 4 },
    { from: 1, to: 6 },
    { from: 3, to: 8 },

  ];

  let arcProgress = arcs.map(() => 0);

  function project(x, y, z) {

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const rx = x * cosA - z * sinA;
    const rz = x * sinA + z * cosA;

    return {
      px: cx + rx,
      py: cy + y,
      z: rz
    };

  }

  function drawGlobe() {

    ctx.clearRect(0, 0, W, H);

    // OUTER GLOW
    const grd = ctx.createRadialGradient(
      cx,
      cy,
      R * 0.7,
      cx,
      cy,
      R * 1.3
    );

    grd.addColorStop(0, 'rgba(124,58,237,.12)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grd;

    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // GLOBE BASE
    const globeGrd = ctx.createRadialGradient(
      cx - 30,
      cy - 30,
      R * 0.1,
      cx,
      cy,
      R
    );

    globeGrd.addColorStop(0, 'rgba(37,99,235,.12)');
    globeGrd.addColorStop(.5, 'rgba(124,58,237,.06)');
    globeGrd.addColorStop(1, 'rgba(8,11,20,.8)');

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);

    ctx.fillStyle = globeGrd;
    ctx.fill();

    ctx.strokeStyle = 'rgba(124,58,237,.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // LATITUDE LINES
    for (let lat = -75; lat <= 75; lat += 30) {

      const phi = lat * Math.PI / 180;

      const yr = R * Math.sin(phi);
      const lr = R * Math.cos(phi);

      ctx.beginPath();

      for (let lon = -180; lon <= 180; lon += 2) {

        const theta = lon * Math.PI / 180;

        const x3 = lr * Math.cos(theta);
        const z3 = lr * Math.sin(theta);

        const p = project(x3, -yr, z3);

        if (lon === -180) {
          ctx.moveTo(p.px, p.py);
        } else {
          ctx.lineTo(p.px, p.py);
        }

      }

      ctx.strokeStyle = 'rgba(96,165,250,.07)';
      ctx.lineWidth = .4;
      ctx.stroke();

    }

    // LONGITUDE LINES
    for (let lon = 0; lon < 360; lon += 30) {

      const theta = lon * Math.PI / 180;

      ctx.beginPath();

      for (let lat = -90; lat <= 90; lat += 2) {

        const phi = lat * Math.PI / 180;

        const x3 = R * Math.cos(phi) * Math.cos(theta);
        const y3 = -R * Math.sin(phi);
        const z3 = R * Math.cos(phi) * Math.sin(theta);

        const p = project(x3, y3, z3);

        if (lat === -90) {
          ctx.moveTo(p.px, p.py);
        } else {
          ctx.lineTo(p.px, p.py);
        }

      }

      ctx.strokeStyle = 'rgba(96,165,250,.07)';
      ctx.lineWidth = .4;
      ctx.stroke();

    }

    // ARCS
    arcs.forEach((arc, i) => {

      const p1 = latLonToXYZ(
        cities[arc.from].lat,
        cities[arc.from].lon,
        R
      );

      const p2 = latLonToXYZ(
        cities[arc.to].lat,
        cities[arc.to].lon,
        R
      );

      const mid = {
        x: (p1.x + p2.x) * .5,
        y: (p1.y + p2.y) * .5 - 40,
        z: (p1.z + p2.z) * .5
      };

      arcProgress[i] = (arcProgress[i] + .004) % 1;

      const steps = 40;

      ctx.beginPath();

      let started = false;

      for (let t = 0; t <= arcProgress[i]; t += 1 / steps) {

        const tt = 1 - t;

        const bx =
          tt * tt * p1.x +
          2 * tt * t * mid.x +
          t * t * p2.x;

        const by =
          tt * tt * p1.y +
          2 * tt * t * mid.y +
          t * t * p2.y;

        const bz =
          tt * tt * p1.z +
          2 * tt * t * mid.z +
          t * t * p2.z;

        const pp = project(bx, by, bz);

        if (pp.z > -R * .3) {

          if (!started) {
            ctx.moveTo(pp.px, pp.py);
            started = true;
          } else {
            ctx.lineTo(pp.px, pp.py);
          }

        }

      }

      ctx.strokeStyle = 'rgba(168,85,247,.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // MOVING DOT
      const td = arcProgress[i];
      const ttd = 1 - td;

      const dotX =
        ttd * ttd * p1.x +
        2 * ttd * td * mid.x +
        td * td * p2.x;

      const dotY =
        ttd * ttd * p1.y +
        2 * ttd * td * mid.y +
        td * td * p2.y;

      const dotZ =
        ttd * ttd * p1.z +
        2 * ttd * td * mid.z +
        td * td * p2.z;

      const dotP = project(dotX, dotY, dotZ);

      if (dotP.z > -R * .3) {

        ctx.beginPath();
        ctx.arc(dotP.px, dotP.py, 3, 0, Math.PI * 2);

        ctx.fillStyle = '#a855f7';

        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;

        ctx.fill();

        ctx.shadowBlur = 0;

      }

    });

    // CITY DOTS
    cities.forEach((city, i) => {

      const pos = latLonToXYZ(city.lat, city.lon, R);

      const p = project(pos.x, pos.y, pos.z);

      if (p.z < -10) return;

      const alpha = Math.min(
        1,
        (p.z + R) / (R * .6)
      );

      ctx.beginPath();
      ctx.arc(p.px, p.py, 3.5, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(96,165,250,${alpha})`;

      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 8;

      ctx.fill();

      ctx.shadowBlur = 0;

    });

    // CLICK DOT EFFECT
    clickDots.forEach((dot, index) => {

      dot.alpha -= 0.015;
      dot.size += 0.4;

      // Glow
      ctx.beginPath();

      ctx.arc(
        dot.x,
        dot.y,
        dot.size * 3,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(168,85,247,${dot.alpha * 0.15})`;

      ctx.fill();

      // Main dot
      ctx.beginPath();

      ctx.arc(
        dot.x,
        dot.y,
        dot.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(255,255,255,${dot.alpha})`;

      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 20;

      ctx.fill();

      ctx.shadowBlur = 0;

      // Ring
      ctx.beginPath();

      ctx.arc(
        dot.x,
        dot.y,
        dot.size * 5,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = `rgba(168,85,247,${dot.alpha * 0.4})`;

      ctx.lineWidth = 1.5;

      ctx.stroke();

      // Remove
      if (dot.alpha <= 0) {
        clickDots.splice(index, 1);
      }

    });

    // SHINE
    const shine = ctx.createRadialGradient(
      cx - R * .35,
      cy - R * .35,
      0,
      cx - R * .35,
      cy - R * .35,
      R * .5
    );

    shine.addColorStop(0, 'rgba(255,255,255,.06)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);

    ctx.fillStyle = shine;
    ctx.fill();

    angle += .004;

    requestAnimationFrame(drawGlobe);

  }

  drawGlobe();

})();