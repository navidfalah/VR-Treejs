import { create } from 'zustand';
import { Vector3 } from 'three';

export type GameObjective =
    | 'check_danger'
    | 'go_to_car'
    | 'open_trunk'
    | 'get_warning_triangle'
    | 'place_warning_triangle'
    | 'get_first_aid_kit'
    | 'go_to_person'
    | 'check_breathing'
    | 'call_ems'
    | 'check_pulse'
    | 'apply_pressure'
    | 'heal_person'
    | 'completed';

interface GameState {
    // Game state
    currentLevel: number;
    isPaused: boolean;
    startTime: number;
    elapsedTime: number;
    isTrunkOpen: boolean;
    hasFirstAidKit: boolean;
    hasBandage: boolean;
    isPersonHealed: boolean;
    dangerChecked: boolean;
    breathingChecked: boolean;
    pulseChecked: boolean;
    pressureApplied: boolean;
    emsCalled: boolean;
    hasWarningTriangle: boolean;
    isTrianglePlaced: boolean;
    trianglePosition: Vector3 | null;

    // First Aid Kit & Bandaging state
    firstAidKitPosition: Vector3 | null;
    isFirstAidKitOpen: boolean;
    isFirstAidKitPlaced: boolean;
    isArmHeld: boolean;
    bandageWraps: number;
    armBandaged: boolean;

    // Player tracking
    playerPosition: Vector3;

    // Interaction tracking
    nearCar: boolean;
    nearPerson: boolean;
    hoveredObject: string | null;

    // Progress tracking
    currentObjective: GameObjective;
    showTutorial: boolean;
    stepsCompleted: number;
    hints: string[];

    // VR Phone state
    isPhoneVisible: boolean;

    // Actions
    togglePause: () => void;
    restartGame: () => void;
    checkDanger: () => void;
    openTrunk: () => void;
    pickUpFirstAidKit: () => void;
    extractBandage: () => void;
    checkBreathing: () => void;
    checkPulse: () => void;
    applyPressure: () => void;
    callEMS: () => void;
    pickUpTriangle: () => void;
    placeTriangle: (position: Vector3) => void;
    healPerson: () => void;
    setLevel: (level: number) => void;

    // First Aid Kit & Bandaging actions
    placeFirstAidKit: (position: Vector3) => void;
    openFirstAidKit: () => void;
    pickUpBandage: () => void;
    grabArm: () => void;
    releaseArm: () => void;
    addBandageWrap: () => void;
    completeBandaging: () => void;

    // Setters
    setPlayerPosition: (pos: Vector3) => void;
    setNearCar: (near: boolean) => void;
    setNearPerson: (near: boolean) => void;
    setHoveredObject: (obj: string | null) => void;
    setShowTutorial: (show: boolean) => void;
    togglePhone: () => void;
}

const getNextObjective = (current: GameObjective, state: Partial<GameState>): GameObjective => {
    // Level 1: Simple Rescue (includes warning triangle + call_ems as step 2)
    if (state.currentLevel === 1) {
        if (current === 'go_to_car' && state.isTrunkOpen) return 'get_warning_triangle';
        if (current === 'open_trunk' && state.isTrunkOpen) return 'get_warning_triangle';
        if (current === 'get_warning_triangle' && state.hasWarningTriangle) return 'place_warning_triangle';
        // Step 2: Call emergency services after placing triangle
        if (current === 'place_warning_triangle' && state.isTrianglePlaced) return 'call_ems';
        if (current === 'call_ems' && state.emsCalled) return 'get_first_aid_kit';
        if (current === 'get_first_aid_kit' && state.hasFirstAidKit) return 'go_to_person';
        if (current === 'go_to_person' && state.nearPerson && state.hasFirstAidKit) return 'heal_person';
        if (current === 'heal_person' && state.isPersonHealed) return 'completed';
    }

    // Level 2: Hazard Focus (Extended, includes warning triangle + call_ems as step 2)
    if (state.currentLevel === 2) {
        if (current === 'check_danger' && state.dangerChecked) return 'go_to_car';
        if (current === 'go_to_car' && state.isTrunkOpen) return 'get_warning_triangle';
        if (current === 'open_trunk' && state.isTrunkOpen) return 'get_warning_triangle';
        if (current === 'get_warning_triangle' && state.hasWarningTriangle) return 'place_warning_triangle';
        // Step 2: Call emergency services after placing triangle
        if (current === 'place_warning_triangle' && state.isTrianglePlaced) return 'call_ems';
        if (current === 'call_ems' && state.emsCalled) return 'get_first_aid_kit';
        if (current === 'get_first_aid_kit' && state.hasFirstAidKit) return 'go_to_person';
        if (current === 'go_to_person' && state.nearPerson) return 'check_breathing';
        if (current === 'check_breathing' && state.breathingChecked) return 'check_pulse';
        if (current === 'check_pulse' && state.pulseChecked) return 'apply_pressure';
        if (current === 'apply_pressure' && state.pressureApplied) return 'heal_person';
        if (current === 'heal_person' && state.isPersonHealed) return 'completed';
    }

    return current;
};

export const useStore = create<GameState>((set) => ({
    // Initial game state
    currentLevel: 1,
    isPaused: false,
    startTime: Date.now(),
    elapsedTime: 0,
    isTrunkOpen: false,
    hasFirstAidKit: false,
    hasBandage: false,
    isPersonHealed: false,
    dangerChecked: false,
    breathingChecked: false,
    pulseChecked: false,
    pressureApplied: false,
    emsCalled: false,
    hasWarningTriangle: false,
    isTrianglePlaced: false,
    trianglePosition: null,

    // First Aid Kit & Bandaging initial state
    firstAidKitPosition: null,
    isFirstAidKitOpen: false,
    isFirstAidKitPlaced: false,
    isArmHeld: false,
    bandageWraps: 0,
    armBandaged: false,

    // Initial tracking
    playerPosition: new Vector3(0, 1.6, 0),
    nearCar: false,
    nearPerson: false,
    hoveredObject: null,

    // Initial progress
    currentObjective: 'go_to_car',
    showTutorial: true,
    stepsCompleted: 0,
    hints: ["Use WASD to move", "Look around with mouse"],

    // VR Phone state
    isPhoneVisible: false,

    // Actions
    togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
    togglePhone: () => set((state) => ({ isPhoneVisible: !state.isPhoneVisible })),

    restartGame: () => set((state) => ({
        currentLevel: state.currentLevel,
        isPaused: false,
        startTime: Date.now(),
        elapsedTime: 0,
        isTrunkOpen: false,
        hasFirstAidKit: false,
        hasBandage: false,
        isPersonHealed: false,
        dangerChecked: false,
        breathingChecked: false,
        pulseChecked: false,
        pressureApplied: false,
        emsCalled: false,
        hasWarningTriangle: false,
        isTrianglePlaced: false,
        trianglePosition: null,
        firstAidKitPosition: null,
        isFirstAidKitOpen: false,
        isFirstAidKitPlaced: false,
        isArmHeld: false,
        bandageWraps: 0,
        armBandaged: false,
        currentObjective: state.currentLevel === 2 ? 'check_danger' : 'go_to_car',
        stepsCompleted: 0,
        playerPosition: new Vector3(0, 1.6, 0),
        nearCar: false,
        nearPerson: false,
        hoveredObject: null,
    })),

    checkDanger: () => set((state) => {
        const newState = { dangerChecked: true, stepsCompleted: state.stepsCompleted + 1 };
        return { ...newState, currentObjective: getNextObjective('check_danger', { ...state, ...newState }) };
    }),

    openTrunk: () => set((state) => {
        const newState = {
            isTrunkOpen: !state.isTrunkOpen,
            stepsCompleted: state.isTrunkOpen ? state.stepsCompleted : state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('open_trunk', { ...state, ...newState })
        };
    }),

    pickUpFirstAidKit: () => set((state) => {
        const newState = {
            hasFirstAidKit: true,
            stepsCompleted: state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('get_first_aid_kit', { ...state, ...newState })
        };
    }),

    extractBandage: () => set((state) => ({
        hasBandage: true,
        stepsCompleted: state.stepsCompleted + 1
    })),

    checkBreathing: () => set((state) => {
        const newState = { breathingChecked: true, stepsCompleted: state.stepsCompleted + 1 };
        return { ...newState, currentObjective: getNextObjective('check_breathing', { ...state, ...newState }) };
    }),

    checkPulse: () => set((state) => {
        const newState = { pulseChecked: true, stepsCompleted: state.stepsCompleted + 1 };
        return { ...newState, currentObjective: getNextObjective('check_pulse', { ...state, ...newState }) };
    }),

    applyPressure: () => set((state) => {
        const newState = { pressureApplied: true, stepsCompleted: state.stepsCompleted + 1 };
        return { ...newState, currentObjective: getNextObjective('apply_pressure', { ...state, ...newState }) };
    }),

    callEMS: () => set((state) => {
        const newState = { emsCalled: true, stepsCompleted: state.stepsCompleted + 1 };
        return { ...newState, currentObjective: getNextObjective('call_ems', { ...state, ...newState }) };
    }),

    pickUpTriangle: () => set((state) => {
        const newState = {
            hasWarningTriangle: true,
            isTrianglePlaced: false,
            stepsCompleted: state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('get_warning_triangle', { ...state, ...newState })
        };
    }),

    placeTriangle: (position: Vector3) => set((state) => {
        const newState = {
            hasWarningTriangle: false,
            isTrianglePlaced: true,
            trianglePosition: position.clone(),
            stepsCompleted: state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('place_warning_triangle', { ...state, ...newState })
        };
    }),

    healPerson: () => set((state) => {
        const newState = {
            isPersonHealed: true,
            hasBandage: false,
            stepsCompleted: state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('heal_person', { ...state, ...newState })
        };
    }),

    setLevel: (level: number) => set(() => ({
        currentLevel: level,
        currentObjective: level === 2 ? 'check_danger' : 'go_to_car',
        stepsCompleted: 0,
        isTrunkOpen: false,
        hasFirstAidKit: false,
        isPersonHealed: false,
        dangerChecked: false,
        breathingChecked: false,
        pulseChecked: false,
        pressureApplied: false,
        emsCalled: false,
        startTime: Date.now(),
        elapsedTime: 0,
        isPaused: false
    })),

    // First Aid Kit & Bandaging Actions
    placeFirstAidKit: (position: Vector3) => set(() => ({
        hasFirstAidKit: false,
        isFirstAidKitPlaced: true,
        firstAidKitPosition: position.clone()
    })),

    openFirstAidKit: () => set(() => ({
        isFirstAidKitOpen: true
    })),

    pickUpBandage: () => set(() => ({
        hasBandage: true
    })),

    grabArm: () => set(() => ({
        isArmHeld: true
    })),

    releaseArm: () => set(() => ({
        isArmHeld: false
    })),

    addBandageWrap: () => set((state) => ({
        bandageWraps: Math.min(state.bandageWraps + 1, 5)
    })),

    completeBandaging: () => set((state) => {
        const newState = {
            armBandaged: true,
            hasBandage: false,
            isArmHeld: false,
            isPersonHealed: true,
            stepsCompleted: state.stepsCompleted + 1
        };
        return {
            ...newState,
            currentObjective: getNextObjective('heal_person', { ...state, ...newState })
        };
    }),

    // Setters
    setPlayerPosition: (pos: Vector3) => set({ playerPosition: pos }),
    setNearCar: (near: boolean) => set((state) => {
        const newState = { nearCar: near };
        return {
            ...newState,
            currentObjective: near && state.currentObjective === 'go_to_car'
                ? 'open_trunk'
                : state.currentObjective
        };
    }),
    setNearPerson: (near: boolean) => set({ nearPerson: near }),
    setHoveredObject: (obj: string | null) => set({ hoveredObject: obj }),
    setShowTutorial: (show: boolean) => set({ showTutorial: show }),
}));
