import { Text } from '@react-three/drei';
import { useStore } from './store';

// Task definitions for Level 1
const LEVEL_1_TASKS = [
    { id: 'go_to_car', label: 'Go to the crashed car' },
    { id: 'open_trunk', label: 'Open the trunk' },
    { id: 'get_warning_triangle', label: 'Get warning triangle' },
    { id: 'place_warning_triangle', label: 'Place warning triangle' },
    { id: 'call_ems', label: 'Call emergency services' },
    { id: 'get_first_aid_kit', label: 'Get first aid kit' },
    { id: 'heal_person', label: 'Help the injured person' },
];

// Task definitions for Level 2 (extended)
const LEVEL_2_TASKS = [
    { id: 'check_danger', label: 'Check for danger' },
    { id: 'go_to_car', label: 'Go to the crashed car' },
    { id: 'open_trunk', label: 'Open the trunk' },
    { id: 'get_warning_triangle', label: 'Get warning triangle' },
    { id: 'place_warning_triangle', label: 'Place warning triangle' },
    { id: 'call_ems', label: 'Call emergency services' },
    { id: 'get_first_aid_kit', label: 'Get first aid kit' },
    { id: 'go_to_person', label: 'Go to the injured person' },
    { id: 'check_breathing', label: 'Check breathing' },
    { id: 'check_pulse', label: 'Check pulse' },
    { id: 'apply_pressure', label: 'Apply pressure to wound' },
    { id: 'heal_person', label: 'Apply first aid' },
];

function isTaskComplete(taskId: string, state: {
    isTrunkOpen: boolean;
    hasWarningTriangle: boolean;
    isTrianglePlaced: boolean;
    emsCalled: boolean;
    hasFirstAidKit: boolean;
    isPersonHealed: boolean;
    dangerChecked: boolean;
    breathingChecked: boolean;
    pulseChecked: boolean;
    pressureApplied: boolean;
    nearCar: boolean;
    nearPerson: boolean;
}): boolean {
    switch (taskId) {
        case 'check_danger': return state.dangerChecked;
        case 'go_to_car': return state.isTrunkOpen; // Considered done when trunk is opened
        case 'open_trunk': return state.isTrunkOpen;
        case 'get_warning_triangle': return state.isTrianglePlaced || state.hasWarningTriangle;
        case 'place_warning_triangle': return state.isTrianglePlaced;
        case 'call_ems': return state.emsCalled;
        case 'get_first_aid_kit': return state.hasFirstAidKit || state.isPersonHealed;
        case 'go_to_person': return state.breathingChecked || state.isPersonHealed;
        case 'check_breathing': return state.breathingChecked;
        case 'check_pulse': return state.pulseChecked;
        case 'apply_pressure': return state.pressureApplied;
        case 'heal_person': return state.isPersonHealed;
        default: return false;
    }
}

export function TaskBillboard() {
    const currentLevel = useStore((state) => state.currentLevel);
    const isTrunkOpen = useStore((state) => state.isTrunkOpen);
    const hasWarningTriangle = useStore((state) => state.hasWarningTriangle);
    const isTrianglePlaced = useStore((state) => state.isTrianglePlaced);
    const emsCalled = useStore((state) => state.emsCalled);
    const hasFirstAidKit = useStore((state) => state.hasFirstAidKit);
    const isPersonHealed = useStore((state) => state.isPersonHealed);
    const dangerChecked = useStore((state) => state.dangerChecked);
    const breathingChecked = useStore((state) => state.breathingChecked);
    const pulseChecked = useStore((state) => state.pulseChecked);
    const pressureApplied = useStore((state) => state.pressureApplied);
    const nearCar = useStore((state) => state.nearCar);
    const nearPerson = useStore((state) => state.nearPerson);

    const gameState = {
        isTrunkOpen, hasWarningTriangle, isTrianglePlaced, emsCalled,
        hasFirstAidKit, isPersonHealed, dangerChecked, breathingChecked,
        pulseChecked, pressureApplied, nearCar, nearPerson
    };

    const tasks = currentLevel === 2 ? LEVEL_2_TASKS : LEVEL_1_TASKS;

    const billboardX = 5.8;
    const billboardY = 3.28;
    const billboardZ = -2.5;

    const billboardWidth = 2.8;
    const billboardHeight = 2.75;

    return (
        <group position={[billboardX, billboardY, billboardZ]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Billboard background - dark panel */}
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[billboardWidth, billboardHeight, 0.1]} />
                <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
            </mesh>

            {/* Billboard frame */}
            <mesh position={[0, 0, -0.02]}>
                <boxGeometry args={[billboardWidth + 0.1, billboardHeight + 0.1, 0.05]} />
                <meshStandardMaterial color="#333355" metalness={0.3} roughness={0.7} />
            </mesh>

            {/* Title */}
            <Text
                position={[0, billboardHeight / 2 - 0.35, 0.01]}
                fontSize={0.22}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                RESCUE PROTOCOL
            </Text>

            {/* Divider line under title */}
            <mesh position={[0, billboardHeight / 2 - 0.55, 0.01]}>
                <planeGeometry args={[billboardWidth - 0.4, 0.02]} />
                <meshBasicMaterial color="#4a4a6a" />
            </mesh>

            {/* Task items - each has a fixed position, only show content when completed */}
            {tasks.map((task, index) => {
                const completed = isTaskComplete(task.id, gameState);

                // Only show completed tasks
                if (!completed) return null;

                // Fixed position based on task index (not dynamic based on completed count)
                const yPos = billboardHeight / 2 - 0.85 - index * 0.28;

                return (
                    <group key={task.id} position={[0, yPos, 0.01]}>
                        {/* Checkbox */}
                        <Text
                            position={[-billboardWidth / 2 + 0.25, 0, 0]}
                            fontSize={0.18}
                            color="#4ade80"
                            anchorX="center"
                            anchorY="middle"
                        >
                            ☑
                        </Text>

                        {/* Task label */}
                        <Text
                            position={[-billboardWidth / 2 + 0.5, 0, 0]}
                            fontSize={0.14}
                            color="#4ade80"
                            anchorX="left"
                            anchorY="middle"
                            maxWidth={billboardWidth - 0.8}
                        >
                            {task.label}
                        </Text>
                    </group>
                );
            })}

            {/* Subtle glow effect behind billboard */}
            <pointLight
                position={[0, 0, 0.5]}
                color="#4a4a8a"
                intensity={0.3}
                distance={3}
            />
        </group>
    );
}
