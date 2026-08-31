# Corpadian Rhythm

A fun and creative visualization of workplace satisfaction cycles using mechanical linkages.

## Concept

The "Corpadian Rhythm" represents the cyclical patterns of how you feel at work based on three overlapping rhythms:

- **Month Cycle (Red arm)**: Longest arm that completes 1 full rotation per month. Satisfaction peaks around payday (end of month) and gradually decreases until the next payday.

- **Week Cycle (Green arm)**: Medium arm that completes 6 rotations per month (one per workweek, Mon-Fri). Friday brings the highest weekly satisfaction, while Wednesday is the lowest.

- **Day Cycle (Blue arm)**: Shortest arm representing the workday (9 AM to 5 PM), with 5 rotations per workweek cycle. End-of-day brings relief and satisfaction compared to the morning slog.

The three arms are connected as a linkage mechanism, and the final end node traces out a complex waveform that represents the combined effect of all three cycles.

## Features

- **Interactive Linkage Visualization**: Watch the three rotating arms combine to show satisfaction over time
- **Real-time Graph**: See the composite waveform of satisfaction throughout a simulated month
- **Playback Controls**: Play/pause the simulation and adjust animation speed
- **Color-coded Display**: The end node changes color from red (low satisfaction) → orange (medium) → green (high satisfaction)

## Technical Details

### Architecture

- `simulation.js`: Core simulation logic for calculating arm angles and satisfaction values
- `visualization.js`: Canvas-based rendering of the linkage mechanism
- `graph.js`: Canvas-based rendering of the satisfaction waveform over time
- `app.js`: Main application controller and event handling

### The Math

Each arm contributes a sinusoidal component:
- **Month**: `sin(2π × time / 30 days) × 100` (1 rotation per month)
- **Week**: `sin(2π × time × 6 / 30 days) × 50` (6 workweek rotations per month)
- **Day**: `sin(2π × time × 30 / 30 days) × 25` (5 rotations per workweek × 6 weeks)

The total satisfaction is the sum of these three components.

### Linkage Mechanism

The linkages use forward kinematics to calculate positions:
1. Start at origin (300, 300)
2. Month arm rotates based on month phase
3. Week arm attached to end of month arm
4. Day arm attached to end of week arm
5. End node position = sum of all three arm vectors

## How to Use

1. Open `index.html` in a web browser
2. Click **Play** to start the simulation
3. Use the **Speed** slider to accelerate or slow down time
4. Click **Reset** to return to the beginning of the month
5. Watch the linkage rotate and the graph update in real-time

## Deployment

This project is designed to be embedded in a portfolio site or run standalone.

### As a Sub-page

To integrate into your main portfolio:
1. Clone/fork this repo
2. Link to it from your portfolio as a project page
3. Or embed the visualization in an iframe

### Standalone

Simply serve the files with any HTTP server:
```
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Future Enhancements

- Toggle individual arms on/off to see their contribution
- Show actual satisfaction values on hover
- Add configurable cycle parameters
- Export the waveform data
- Add hour/minute level granularity
- Sound effects/audio visualization

## License

Open source - feel free to use and modify!

---

**Created**: August 2026  
**Author**: Mason Watts
