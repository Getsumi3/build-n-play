# One Button

**Status:** In development  
**Type:** 2D reaction arcade  
**Platform:** Mobile-first web  
**Stack:** TypeScript, Vite, Canvas 2D, SCSS, Web Audio API

## Concept

A minimalist arcade game about switching between two lanes to avoid incoming obstacles. The player moves automatically, and the goal is to survive as long as possible.

## Gameplay

- Portrait layout designed for one-handed play.
- Tap anywhere to switch lanes.
- Obstacles approach from right to left.
- The player stays in the lower half of the screen.
- Every tap plays a short synthesized note.

## Visual & Audio Direction

Dark background, bright geometric shapes, and electric cyan glow. Simple synthesized notes add musical feedback without turning the game into a rhythm game.

## Development Plan

Build the game incrementally. Complete and test each milestone before moving to the next one. Keep the first playable version small and avoid adding features outside the agreed scope.

### 1. Foundation — responsive playfield

- [ ] Clean up the starter page and remove placeholder content.
- [ ] Set up a full-screen, mobile-first game layout.
- [ ] Make the playfield portrait-oriented (target 9:16) and responsive.
- [ ] Account for mobile safe areas.
- [ ] Set up Canvas resizing and device-pixel-ratio scaling.
- [ ] Render a static scene: background, two lanes, and player placeholder.
- [ ] Verify the layout at different phone sizes and in a desktop browser.

**Done when:** the Canvas fills the available play area, scales cleanly, and displays the static scene without distortion.

### 2. Player — lane switching

- [ ] Define the two lane positions using normalized coordinates.
- [ ] Position the player in the lower half of the playfield.
- [ ] Implement lane switching on tap and mouse click.
- [ ] Add Spacebar support for desktop.
- [ ] Choose and implement instant or smoothly animated switching.
- [ ] Prevent input handling from causing unwanted page scrolling or selection.

**Done when:** the player reliably switches between both lanes on touch and desktop input.

### 3. Movement — world and obstacles

- [ ] Add a time-based game loop using `requestAnimationFrame`.
- [ ] Move the world from right to left.
- [ ] Create the first obstacle shape.
- [ ] Spawn obstacles with simple, predictable timing.
- [ ] Move obstacles across the playfield and remove them when off-screen.
- [ ] Keep movement consistent across different frame rates.

**Done when:** the player can move between lanes while obstacles continuously approach.

### 4. Gameplay — collisions and score

- [ ] Implement collision detection between the player and obstacles.
- [ ] End the run when a collision occurs.
- [ ] Add a survival-based score.
- [ ] Increase difficulty gradually over time.
- [ ] Tune obstacle spacing and speed so the game is challenging but fair.

**Done when:** a run can be played from start to collision, with score and difficulty progression.

### 5. Audio and visual effects

- [ ] Set up a small Web Audio API synthesizer.
- [ ] Add one short note for each lane.
- [ ] Choose two harmonious notes and simple waveforms.
- [ ] Add a subtle accent for successful avoidance if it improves feedback.
- [ ] Add a distinct collision sound.
- [ ] Add restrained cyan glow, motion trails, and subtle particles.
- [ ] Check audio startup requirements and performance on mobile.

**Done when:** input and gameplay have clear audio-visual feedback without distracting from play.

### 6. Game flow and interface

- [ ] Add a start screen.
- [ ] Add score display.
- [ ] Add a game-over screen.
- [ ] Add restart functionality.
- [ ] Ensure each new run resets score, obstacles, difficulty, and player state.
- [ ] Verify that touch and keyboard controls work throughout the game flow.

**Done when:** the game can be started, played, lost, and restarted without refreshing the page.

### 7. Polish and release check

- [ ] Test on a real mobile browser.
- [ ] Test desktop mouse and keyboard controls.
- [ ] Check portrait layout, safe areas, and different screen sizes.
- [ ] Check for visual glitches, input issues, and performance problems.
- [ ] Run linting and formatting checks.
- [ ] Run the production build and fix any errors.
- [ ] Update this README if the implemented behavior differs from the plan.

**Done when:** the first playable version works reliably on mobile and desktop and passes the project checks.

## Out of Scope for the First Version

- Procedural music or rhythm-based gameplay.
- Multiple instruments or complex audio systems.
- Power-ups and special abilities.
- Leaderboards and online features.
- Unlockables, progression systems, and elaborate menus.

## Development

From the repository root:

```bash
npm run dev
npm run build
```
