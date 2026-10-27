"use client";

import { useEffect, useRef } from "react";

// Walking figure drawn from joint angles. Speeds up while the page scrolls.

const W = 420;
const H = 380;
const GROUND = 300;
const THIGH = 72;
const SHANK = 70;
const FOOT = 20;
const TORSO = 86;
const UPPER_ARM = 50;
const FOREARM = 46;
const TRACE_N = 180;
const TRACE_TOP = 326;
const TRACE_H = 44;

const rad = (d: number) => (d * Math.PI) / 180;
type P = { x: number; y: number };
const add = (p: P, len: number, angDeg: number): P => ({
  // angle measured from straight down, positive = forward (to the right)
  x: p.x + len * Math.sin(rad(angDeg)),
  y: p.y + len * Math.cos(rad(angDeg)),
});

function legAngles(phase: number) {
  const hip = 24 * Math.sin(phase);
  const swing = Math.max(0, Math.cos(phase + 0.45));
  const stance = Math.max(0, Math.sin(phase * 2 + 1)) * 0.25;
  const knee = 4 + 58 * swing * swing + 12 * stance;
  return { hip, knee };
}

function solveLeg(hipP: P, phase: number) {
  const { hip, knee } = legAngles(phase);
  const kneeP = add(hipP, THIGH, hip);
  const shankAng = hip - knee;
  const ankleP = add(kneeP, SHANK, shankAng);
  const toeP = add(ankleP, FOOT, shankAng + 90);
  return { kneeP, ankleP, toeP, hip, knee };
}

export default function GaitFigure() {
  const svgRef = useRef<SVGSVGElement>(null);
  const readHip = useRef<HTMLSpanElement>(null);
  const readKnee = useRef<HTMLSpanElement>(null);
  const readCad = useRef<HTMLSpanElement>(null);
  const readPhase = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const q = <T extends SVGElement>(id: string) => svg.querySelector<T>(`[data-k="${id}"]`)!;

    const bones = {
      thighF: q<SVGLineElement>("thighF"), shankF: q<SVGLineElement>("shankF"), footF: q<SVGLineElement>("footF"),
      thighB: q<SVGLineElement>("thighB"), shankB: q<SVGLineElement>("shankB"), footB: q<SVGLineElement>("footB"),
      torso: q<SVGLineElement>("torso"),
      uArmF: q<SVGLineElement>("uArmF"), fArmF: q<SVGLineElement>("fArmF"),
      uArmB: q<SVGLineElement>("uArmB"), fArmB: q<SVGLineElement>("fArmB"),
    };
    const joints = {
      hip: q<SVGCircleElement>("hip"), kneeF: q<SVGCircleElement>("kneeF"), ankleF: q<SVGCircleElement>("ankleF"),
      kneeB: q<SVGCircleElement>("kneeB"), ankleB: q<SVGCircleElement>("ankleB"),
      shoulder: q<SVGCircleElement>("shoulder"), elbowF: q<SVGCircleElement>("elbowF"), wristF: q<SVGCircleElement>("wristF"),
      elbowB: q<SVGCircleElement>("elbowB"), wristB: q<SVGCircleElement>("wristB"),
    };
    const head = q<SVGCircleElement>("head");
    const arc = q<SVGPathElement>("arc");
    const arcLabel = q<SVGTextElement>("arcLabel");
    const trace = q<SVGPolylineElement>("trace");
    const traceDot = q<SVGCircleElement>("traceDot");
    const ticks = q<SVGGElement>("ticks");

    const line = (el: SVGLineElement, a: P, b: P) => {
      el.setAttribute("x1", a.x.toFixed(1)); el.setAttribute("y1", a.y.toFixed(1));
      el.setAttribute("x2", b.x.toFixed(1)); el.setAttribute("y2", b.y.toFixed(1));
    };
    const dot = (el: SVGCircleElement, p: P) => {
      el.setAttribute("cx", p.x.toFixed(1)); el.setAttribute("cy", p.y.toFixed(1));
    };

    const history: number[] = new Array(TRACE_N).fill(4);
    let phase = 0.6;
    let boost = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let groundShift = 0;
    let raf = 0;
    let visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      boost = Math.min(2.4, boost + dy / 220);
    };

    const draw = (dt: number) => {
      const baseHz = 0.85; // gait cycles per second
      const hz = baseHz * (1 + boost);
      boost *= Math.pow(0.12, dt); // decay
      phase = (phase + dt * hz * Math.PI * 2) % (Math.PI * 2);

      // place hip so the lower foot touches the ground
      const probe = { x: 0, y: 0 };
      const fF = solveLeg(probe, phase);
      const fB = solveLeg(probe, phase + Math.PI);
      const low = Math.max(fF.ankleP.y, fB.ankleP.y, fF.toeP.y, fB.toeP.y);
      const hipP = { x: 196, y: GROUND - low };

      const F = solveLeg(hipP, phase);
      const B = solveLeg(hipP, phase + Math.PI);
      const shoulderP = { x: hipP.x + 6, y: hipP.y - TORSO };
      const headP = { x: shoulderP.x + 5, y: shoulderP.y - 24 };

      // arms swing opposite to the leg on the same side
      const armF = -20 * Math.sin(phase);
      const armB = -20 * Math.sin(phase + Math.PI);
      const elbowF = add(shoulderP, UPPER_ARM, armF);
      const wristF = add(elbowF, FOREARM, armF + 18 + 10 * Math.max(0, Math.sin(phase)));
      const elbowB = add(shoulderP, UPPER_ARM, armB);
      const wristB = add(elbowB, FOREARM, armB + 18 + 10 * Math.max(0, Math.sin(phase + Math.PI)));

      line(bones.thighF, hipP, F.kneeP); line(bones.shankF, F.kneeP, F.ankleP); line(bones.footF, F.ankleP, F.toeP);
      line(bones.thighB, hipP, B.kneeP); line(bones.shankB, B.kneeP, B.ankleP); line(bones.footB, B.ankleP, B.toeP);
      line(bones.torso, hipP, shoulderP);
      line(bones.uArmF, shoulderP, elbowF); line(bones.fArmF, elbowF, wristF);
      line(bones.uArmB, shoulderP, elbowB); line(bones.fArmB, elbowB, wristB);
      dot(joints.hip, hipP); dot(joints.kneeF, F.kneeP); dot(joints.ankleF, F.ankleP);
      dot(joints.kneeB, B.kneeP); dot(joints.ankleB, B.ankleP);
      dot(joints.shoulder, shoulderP); dot(joints.elbowF, elbowF); dot(joints.wristF, wristF);
      dot(joints.elbowB, elbowB); dot(joints.wristB, wristB);
      dot(head, headP);

      // knee angle arc on the near leg, between thigh extension and shank
      const r = 20;
      const a1 = F.hip; // thigh direction continued through the knee
      const a2 = F.hip - F.knee; // shank direction
      const p1 = add(F.kneeP, r, a1);
      const p2 = add(F.kneeP, r, a2);
      arc.setAttribute(
        "d",
        `M${F.kneeP.x.toFixed(1)},${F.kneeP.y.toFixed(1)} L${p1.x.toFixed(1)},${p1.y.toFixed(1)} A${r},${r} 0 0 1 ${p2.x.toFixed(1)},${p2.y.toFixed(1)} Z`
      );
      const lab = add(F.kneeP, r + 13, (a1 + a2) / 2);
      arcLabel.setAttribute("x", lab.x.toFixed(1));
      arcLabel.setAttribute("y", lab.y.toFixed(1));
      arcLabel.textContent = `${Math.round(F.knee)}°`;

      // ground ticks slide backwards like a treadmill
      groundShift = (groundShift + dt * hz * 150) % 30;
      ticks.setAttribute("transform", `translate(${-groundShift},0)`);

      // knee-angle trace 
      history.push(F.knee);
      history.shift();
      const pts = history
        .map((v, i) => {
          const x = 20 + (i / (TRACE_N - 1)) * (W - 40);
          const y = TRACE_TOP + TRACE_H - (v / 70) * TRACE_H;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
      trace.setAttribute("points", pts);
      traceDot.setAttribute("cx", String(W - 20));
      traceDot.setAttribute("cy", (TRACE_TOP + TRACE_H - (F.knee / 70) * TRACE_H).toFixed(1));

      if (readHip.current) readHip.current.textContent = `${F.hip >= 0 ? "+" : "−"}${Math.abs(F.hip).toFixed(1)}°`;
      if (readKnee.current) readKnee.current.textContent = `${F.knee.toFixed(1)}°`;
      if (readCad.current) readCad.current.textContent = `${Math.round(hz * 120)}`;
      if (readPhase.current) readPhase.current.textContent = `${Math.round((phase / (Math.PI * 2)) * 100)}%`;
    };

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      if (visible) draw(dt);
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      for (let i = 0; i < TRACE_N; i++) draw(1 / 60);
    } else {
      // pre-fill the trace so it never starts flat
      for (let i = 0; i < TRACE_N; i++) draw(1 / 60);
      raf = requestAnimationFrame(tick);
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      lastT = performance.now();
    });
    io.observe(svg);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const bone = (k: string, back = false) => (
    <line data-k={k} className={back ? "bone bone--back" : "bone"} />
  );
  const joint = (k: string, back = false) => (
    <circle data-k={k} r={back ? 3.2 : 4.2} className={back ? "joint joint--back" : "joint"} />
  );

  return (
    <figure className="gait">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Animated motion-capture figure walking, with a live knee-angle readout">
        {/* far side first */}
        {bone("thighB", true)}{bone("shankB", true)}{bone("footB", true)}
        {bone("uArmB", true)}{bone("fArmB", true)}
        {joint("kneeB", true)}{joint("ankleB", true)}{joint("elbowB", true)}{joint("wristB", true)}

        {bone("torso")}
        <circle data-k="head" r={15} className="head" />
        <path data-k="arc" className="arc" />
        <text data-k="arcLabel" className="arc-label" textAnchor="middle" dominantBaseline="middle" />
        {bone("thighF")}{bone("shankF")}{bone("footF")}
        {bone("uArmF")}{bone("fArmF")}
        {joint("hip")}{joint("kneeF")}{joint("ankleF")}{joint("shoulder")}{joint("elbowF")}{joint("wristF")}

        {/* ground */}
        <line x1={20} x2={W - 20} y1={GROUND} y2={GROUND} className="ground" />
        <clipPath id="groundClip"><rect x={20} y={GROUND} width={W - 40} height={10} /></clipPath>
        <g clipPath="url(#groundClip)">
          <g data-k="ticks">
            {Array.from({ length: 16 }, (_, i) => (
              <line key={i} x1={20 + i * 30} x2={14 + i * 30} y1={GROUND} y2={GROUND + 8} className="tick" />
            ))}
          </g>
        </g>

        {/* trace */}
        <text x={20} y={TRACE_TOP - 6} className="trace-label">KNEE FLEXION · NEAR LEG</text>
        <text x={W - 20} y={TRACE_TOP - 6} className="trace-label" textAnchor="end">0–70°</text>
        <line x1={20} x2={W - 20} y1={TRACE_TOP + TRACE_H} y2={TRACE_TOP + TRACE_H} className="trace-axis" />
        <polyline data-k="trace" className="trace" />
        <circle data-k="traceDot" r={3} className="trace-dot" />
      </svg>
      <figcaption className="readout" aria-hidden="true">
        <span>hip <b ref={readHip}>0°</b></span>
        <span>knee <b ref={readKnee}>0°</b></span>
        <span>cadence <b ref={readCad}>0</b> spm</span>
        <span>phase <b ref={readPhase}>0%</b></span>
      </figcaption>
    </figure>
  );
}
