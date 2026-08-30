import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useXRInputSourceState } from '@react-three/xr';
import { useStore } from './store';
import * as THREE from 'three';

// System that detects bandage wrapping motion around the arm
export function BandagingSystem() {
    const hasBandage = useStore((state) => state.hasBandage);
    const isArmHeld = useStore((state) => state.isArmHeld);
    const armBandaged = useStore((state) => state.armBandaged);
    const bandageWraps = useStore((state) => state.bandageWraps);
    const addBandageWrap = useStore((state) => state.addBandageWrap);
    const completeBandaging = useStore((state) => state.completeBandaging);

    // Get right hand/controller for bandage tracking
    const rightController = useXRInputSourceState('controller', 'right');
    const rightHand = useXRInputSourceState('hand', 'right');
    const bandageInputSource = rightHand || rightController;

    // Track cumulative rotation
    const lastAngleRef = useRef<number | null>(null);
    const cumulativeRotationRef = useRef(0);
    const lastWrapCountRef = useRef(0);

    useFrame(() => {
        // Only track when both arm is held AND bandage is in hand
        if (!hasBandage || !isArmHeld || armBandaged) {
            lastAngleRef.current = null;
            cumulativeRotationRef.current = 0;
            return;
        }

        if (!bandageInputSource?.object) {
            return;
        }

        // Get the bandage hand position
        const handPosition = new THREE.Vector3();
        bandageInputSource.object.getWorldPosition(handPosition);

        // Calculate angle relative to the arm center (approximate arm position for the injured person)
        const armCenter = new THREE.Vector3(-4.57, 0.1, 2.32);

        const dx = handPosition.x - armCenter.x;
        const dy = handPosition.y - armCenter.y;

        const currentAngle = Math.atan2(dy, dx);

        if (lastAngleRef.current !== null) {
            // Calculate angle delta
            let delta = currentAngle - lastAngleRef.current;

            // Handle wraparound at ±π
            if (delta > Math.PI) delta -= 2 * Math.PI;
            if (delta < -Math.PI) delta += 2 * Math.PI;

            // Accumulate rotation
            cumulativeRotationRef.current += Math.abs(delta);

            const wrapsCompleted = Math.floor(cumulativeRotationRef.current / (2 * Math.PI));

            if (wrapsCompleted > lastWrapCountRef.current) {
                // Add a bandage wrap
                addBandageWrap();
                lastWrapCountRef.current = wrapsCompleted;

                // Check if bandaging is complete
                if (bandageWraps + 1 >= 5) {
                    completeBandaging();
                }
            }
        }

        lastAngleRef.current = currentAngle;
    });

    return null;
}

export function DesktopBandaging() {
    const hasBandage = useStore((state) => state.hasBandage);
    const armBandaged = useStore((state) => state.armBandaged);

    if (!hasBandage || armBandaged) {
        return null;
    }

    return null;
}
