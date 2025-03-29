'use strict';

// Generating "shared.particleAngles(1-3)" and "shared.particlePosition(1-3)" to be used by the particle layers "Holi (1-3)"

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'speedMultiplier',
        label: 'Speed Multiplier',
        value: 1,
        min: 0.5,
        max: 1,
        integer: false
    })
    .addCheckbox({
        name: 'idleMovement',
        label: 'Idle Movement',
        value: true
    })
    .addCheckbox({
        name: 'onlyIdleMovement',
        label: 'ONLY Idle Movement',
        value: true
    })
    .finish();

let simulatedCursorPos = [new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0)];
let lastSimulatedUpdate = [0, 0, 0];
let lastCursorPos = [new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0)];
let lastMoveTime = [0, 0, 0];
let isSimulating = [false, false, false];

// Values specific to each entity (particle layer)
let entities = [
    {maxSpeed: 3,   turnFactor: 4,      minSpeedFactor: 0.85,   brakingFactor: 0.55,    currentPos: new Vec3(0, 0, 0),          velocity: new Vec3(1, 0, 0),    simulationUpdateInterval: 1.02,},
    {maxSpeed: 5,   turnFactor: 3.5,    minSpeedFactor: 0.8,    brakingFactor: 0.5,     currentPos: new Vec3(3840, 2160, 0),    velocity: new Vec3(1, 0, 0),    simulationUpdateInterval: 1.87,},
    {maxSpeed: 4,   turnFactor: 3.75,   minSpeedFactor: 0.75,   brakingFactor: 0.45,    currentPos: new Vec3(1920, 1080, 0),    velocity: new Vec3(1, 0, 0),    simulationUpdateInterval: 1.33,}
];

export function update() {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        let cursorPos = input.cursorWorldPosition;
        let timeSinceMove = engine.runtime - lastMoveTime[i];                   // track last curser movement 
        let timeSinceLastSimUpdate = engine.runtime - lastSimulatedUpdate[i];   // track last simulated curser movement
        
        entity.simulationUpdateInterval = (entity.simulationUpdateInterval / (entity.simulationUpdateInterval * scriptProperties.speedMultiplier));

        // When user is moving the curser the script will use the cursers current position
        if (cursorPos.x !== lastCursorPos[i].x && !scriptProperties.onlyIdleMovement || cursorPos.y !== lastCursorPos[i].y && !scriptProperties.onlyIdleMovement) {
            lastMoveTime[i] = engine.runtime;
            isSimulating[i] = false;
            lastCursorPos[i] = cursorPos.copy();

        // When user is idle (not moving curser for 1.5+ seconds) the script will simulate random curser positions
        } else if (!isSimulating[i] && scriptProperties.idleMovement && timeSinceMove > entity.simulationUpdateInterval || engine.isScreensaver() || scriptProperties.onlyIdleMovement) {
            isSimulating[i] = true;
            simulatedCursorPos[i] = generateRandomCursorPos();
            lastSimulatedUpdate[i] = engine.runtime;
        }
        // Get new simulated cursor position based on that entities simulationUpdateInterval
        if (isSimulating[i] && timeSinceLastSimUpdate > entity.simulationUpdateInterval) {
            simulatedCursorPos[i] = generateRandomCursorPos();
            lastSimulatedUpdate[i] = engine.runtime;
        }

        if (isSimulating[i]) {
            cursorPos = simulatedCursorPos[i];
        }

        // Some generic movement rules that result in okay-ish natural movement
        let moveX = cursorPos.x - entity.currentPos.x;
        let moveY = cursorPos.y - entity.currentPos.y;
        let distance = Math.sqrt(moveX * moveX + moveY * moveY); 
        let desiredDirection = new Vec3(moveX, moveY, 0).normalize();
        let currentDirection = entity.velocity.normalize();

        // Simulate very basic velocity by adjusting the maximum turning angle based on speed
        let speedFactor = entity.velocity.length() / ((entity.maxSpeed * scriptProperties.speedMultiplier) * 450);
        let adaptiveTurnAngle = WEMath.mix(entity.turnFactor, 1, speedFactor) * engine.frametime;
        let blendedDirection = currentDirection.mix(desiredDirection, adaptiveTurnAngle).normalize();
        
        // Change speed based on curser distance to slightly redirect the layers velocity 
        let targetSpeedMultiplier = WEMath.mix(entity.minSpeedFactor, 1, WEMath.smoothStep(50, 500, distance));
        let currentSpeed = entity.velocity.length() / ((entity.maxSpeed * scriptProperties.speedMultiplier) * 450);

        // Cap the speed to that entities maxSpeed
        let adjustedSpeedMultiplier = currentSpeed > targetSpeedMultiplier
            ? WEMath.mix(targetSpeedMultiplier, currentSpeed, entity.brakingFactor)
            : targetSpeedMultiplier;

        entity.velocity = blendedDirection.multiply(((entity.maxSpeed * scriptProperties.speedMultiplier) * 450 * adjustedSpeedMultiplier) * engine.frametime);
        entity.currentPos = entity.currentPos.add(entity.velocity);

        // Generating movement angle to simulate initial velocity for the particles 
        let angleRad = Math.atan2(-entity.velocity.x, entity.velocity.y);
        let angleDeg = angleRad * WEMath.rad2deg;

        // Using shared values to hopefully dodge any script execution order issues
        let index = i + 1;
        shared[`particleAngles${index}`] = new Vec3(0, 0, angleDeg);
        shared[`particlePosition${index}`] = entity.currentPos;
    }
}

export function generateRandomCursorPos() {
    // Comparing project aspect ratio to users screen aspect ratio
    let screenAspectRatio = engine.screenResolution.x / engine.screenResolution.y;
    let canvasAspectRatio = engine.canvasSize.x / engine.canvasSize.y;

    let adjustedXRange = engine.canvasSize.x;
    let xOffset = 0;

    // Range on the X-Axis is adjusted to cover ultrawide screens, if necessary
    if (screenAspectRatio > canvasAspectRatio) {
        let expansionFactor = screenAspectRatio / canvasAspectRatio;
        adjustedXRange *= expansionFactor;
        xOffset = (adjustedXRange - engine.canvasSize.x) / 2;
    }

    let randomX = Math.random() * adjustedXRange - xOffset;
    let randomY = Math.random() * engine.canvasSize.y;

    return new Vec3(randomX, randomY, 0);
}