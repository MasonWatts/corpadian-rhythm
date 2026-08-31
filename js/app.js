/**
 * Main application controller
 */

class CorpadianRhythmApp {
    constructor() {
        this.simulation = new CorpadianSimulation();
        this.visualizer = new LinkageVisualizer('linkageCanvas');
        this.graph = new SatisfactionGraph('graphCanvas');
        
        this.isRunning = false;
        this.animationFrameId = null;
        this.lastTime = performance.now();
        
        this.setupControls();
        this.render();
    }
    
    setupControls() {
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());
        document.getElementById('speedSlider').addEventListener('input', (e) => this.setSpeed(e.target.value));
    }
    
    togglePlayPause() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('playPauseBtn');
        btn.textContent = this.isRunning ? 'Pause' : 'Play';
        
        if (this.isRunning) {
            this.lastTime = performance.now();
            this.animate();
        }
    }
    
    resetSimulation() {
        this.simulation.reset();
        this.isRunning = false;
        document.getElementById('playPauseBtn').textContent = 'Play';
        this.updateTimeDisplay();
        this.render();
    }
    
    setSpeed(value) {
        const speed = parseFloat(value);
        this.simulation.setSpeed(speed);
        document.getElementById('speedValue').textContent = speed.toFixed(1) + 'x';
    }
    
    animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        this.simulation.update(deltaTime);
        this.updateTimeDisplay();
        this.render();
        
        if (this.isRunning) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }
    
    updateTimeDisplay() {
        const timeInfo = this.simulation.getTimeDisplay(this.simulation.currentTime);
        document.getElementById('timeDisplay').textContent = timeInfo.formatted;
    }
    
    render() {
        this.visualizer.draw(this.simulation);
        this.graph.draw(this.simulation);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CorpadianRhythmApp();
});
