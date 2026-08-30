import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from './store';
import { Vector3, Group } from 'three';
import { Html } from '@react-three/drei';

export function GuidanceSystem() {
    const hudRef = useRef<Group>(null);
    const { camera } = useThree();
    const currentObjective = useStore((state) => state.currentObjective);

    // Determine current message
    let message = "";

    switch (currentObjective) {
        case 'check_danger':
            message = "Check for Danger";
            break;
        case 'go_to_car':
            message = "Go to Car";
            break;
        case 'open_trunk':
            message = "Open Trunk";
            break;
        case 'get_warning_triangle':
            message = "Get Warning Triangle";
            break;
        case 'place_warning_triangle':
            message = "Place Triangle on Road";
            break;
        case 'get_first_aid_kit':
            message = "Get First Aid Kit";
            break;
        case 'go_to_person':
            message = "Go to Victim";
            break;
        case 'check_breathing':
            message = "Check Breathing";
            break;
        case 'check_pulse':
            message = "Check Pulse";
            break;
        case 'call_ems':
            message = "Call 911";
            break;
        case 'apply_pressure':
            message = "Apply Pressure";
            break;
        case 'heal_person':
            message = "Heal Victim";
            break;
        case 'completed':
            message = "Finished!";
            break;
        default:
            message = "";
    }

    // Follow camera position and rotation to stay in view
    useFrame(() => {
        if (hudRef.current && message) {
            // Position the HUD in front of the camera
            const forward = new Vector3(0, 0, -2); // 2 meters in front
            forward.applyQuaternion(camera.quaternion);

            hudRef.current.position.copy(camera.position).add(forward);
            hudRef.current.position.y = camera.position.y + 1.5; // Slightly higher

            // Make it face the camera
            hudRef.current.lookAt(camera.position);
        }
    });

    if (!message) return null;

    return (
        <group ref={hudRef}>
            <Html center style={{ pointerEvents: 'none' }}>
                <div style={{
                    background: 'rgba(0, 0, 0, 0.85)',
                    color: '#00ff00',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    border: '2px solid #00ff00',
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    {message}
                </div>
            </Html>
        </group>
    );
}