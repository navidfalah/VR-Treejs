import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import React from 'react';
import { GameScene } from './GameScene';
import { GameUI } from './GameUI';

const store = createXRStore({
  // Disable unsupported features to prevent warnings
  domOverlay: false,
  layers: false,
  meshDetection: false,
  planeDetection: false,
  handTracking: true,
  depthSensing: false,
  hitTest: false,
  anchors: false,
});

function App() {
  return (
    <>
      <div style={{
        position: 'absolute',
        zIndex: 1,
        padding: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        { }
        <button
          onClick={() => store.enterVR()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          Enter VR
        </button>
      </div>

      {/* Game UI Overlay */}
      <GameUI />

      <Canvas
        camera={{ position: [0, 1.6, 8], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Stats />
        <XR store={store}>
          <React.Suspense fallback={null}>
            <GameScene />
          </React.Suspense>
        </XR>
      </Canvas>
    </>
  );
}

export default App;
