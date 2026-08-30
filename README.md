# 🚑 VR Rescue Training

A browser-based **WebXR first-aid training simulator**. You arrive at a street accident, secure the scene, call emergency services, and treat an injured victim — in desktop mode with mouse/keyboard, or fully in VR with hand tracking and motion controllers.

Built with **React Three Fiber**, **@react-three/xr (WebXR)**, **TypeScript**, and **Zustand**.

## Features

- **Two training scenarios**
  - *Level 1 — Simple Rescue*: secure the scene, call EMS, and bandage the victim.
  - *Level 2 — Hazard Focus*: adds a scene danger check, breathing check, pulse check, and pressure application before bandaging.
- **Objective-driven gameplay** — a `Zustand` store tracks progress and advances a single `currentObjective` state machine as you complete each step; an in-world billboard and side panel always show what to do next.
- **Interactive first-aid procedure** — open the car trunk, retrieve and place a warning triangle, retrieve the first aid kit, open it, and wrap a bandage around the victim's arm step by step.
- **Simulated emergency call** — a VR phone with a dialer and a scripted dispatcher chat (typewriter effect + branching options) that walks you through describing the emergency.
- **Full VR support** — hand tracking, controller-based locomotion (left stick to move, right stick to turn), and objects that attach to your hand/controller when picked up.
- **Desktop fallback controls** — WASD + mouse-look with pointer lock, click-to-interact, and keyboard shortcuts for every VR-only action.
- **A hand-built city block** — procedurally laid out buildings, parked cars, buses, street props, a crashed car with fire/smoke particle effects, and a damaged building facade.
- **Resilience** — a loading screen while 3D assets initialize and an error boundary around the scene so a rendering error doesn't take down the whole page.

## Tech Stack

| Purpose | Library |
|---|---|
| Rendering | [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) |
| WebXR (VR) | [`@react-three/xr`](https://github.com/pmndrs/xr) |
| Helpers (loaders, primitives) | [`@react-three/drei`](https://github.com/pmndrs/drei) |
| State management | [`zustand`](https://github.com/pmndrs/zustand) |
| Language / tooling | TypeScript, Vite, ESLint |

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A WebXR-capable browser and headset for VR mode (Chrome/Edge on desktop or Meta Quest Browser). Desktop mode works in any modern browser without a headset.

### Install & run

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`) in your browser.

### Other scripts

```bash
npm run build    # Type-check and build a production bundle to dist/
npm run preview  # Serve the production build locally
npm run lint      # Run ESLint
```

## Controls

| Action | Desktop | VR |
|---|---|---|
| Move | `W` `A` `S` `D` / arrow keys | Left thumbstick |
| Look / turn | Mouse (click canvas to lock pointer) | Head + right thumbstick (smooth turn) |
| Ascend / descend | `Space` / `Shift` | — |
| Interact / pick up | Click | Pinch (hand tracking) or trigger (controller) |
| Place item | `T` (warning triangle) | Point and select |
| Call EMS | `C` | Use the in-scene VR phone |

## How to Play

1. Put on the tutorial screen's instructions, then approach the crashed car.
2. Open the trunk, take the warning triangle, and place it near the scene to warn traffic.
3. Call emergency services and answer the dispatcher's questions.
4. Retrieve the first aid kit from the trunk and open it.
5. Go to the injured person and follow the on-screen objective — in Level 2 this includes checking for danger, breathing, and pulse before treatment.
6. Apply pressure and wrap the bandage to complete the rescue.

Your elapsed time is tracked and shown on the victory screen when the scenario is complete; use **Restart** at any point to reset the current level.

## Project Structure

```
src/
├── App.tsx                # Canvas setup, XR store, loading/error boundaries
├── GameScene.tsx           # Scene composition — places every object in the world
├── store.ts                 # Zustand store: game/objective state machine
├── GameUI.tsx / GameUI.css  # 2D HUD: tutorial, pause, victory, help overlays
├── PlayerController.tsx     # Desktop WASD + mouse-look movement & collision
├── VRHandControllers.tsx    # VR locomotion (XROrigin + controller/hand tracking)
├── VRHeldItems.tsx           # Attaches picked-up items to the VR hand/controller
├── VRPhone.tsx                # In-world phone UI: dialer + dispatcher chat
├── HighFidelityCar.tsx, ParkedCar.tsx, Bus.tsx  # Vehicle models
├── FirstAidKit.tsx, Bandage.tsx, BandagingSystem.tsx  # First-aid interaction chain
├── WarningTriangle.tsx, EmergencyPhone.tsx      # Scene safety props
├── Person.tsx, CrashDamage.tsx, ParticleEffects.tsx  # Victim, damage, fire/smoke FX
├── Buildings.tsx, Street.tsx, Environment.tsx, EnvironmentalProps.tsx  # City environment
└── TaskBillboard.tsx, GuidanceSystem.tsx        # In-world objective signage
```

State flows one way: gameplay components read from and dispatch actions to the central `useStore` (Zustand), which derives the next objective from the current one via `getNextObjective` in [`src/store.ts`](src/store.ts).

## Notes

- `three` is pinned to `0.170.0` (via `package.json` `overrides`) to stay compatible with the current `@react-three/fiber`/`@react-three/xr` versions.
- VR mode is entered via the **Enter VR** button, which requires a secure context (`https://` or `localhost`) and a WebXR-capable browser/device.
