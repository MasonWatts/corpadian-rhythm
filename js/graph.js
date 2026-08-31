/**
 * Graph visualization for the satisfaction cycle
 */

class SatisfactionGraph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.padding = 55;
        this.height = this.canvas.height - this.padding * 2;
        this.width = this.canvas.width - this.padding * 2;
        
        // Time window shown on screen (20 workdays total, centered on current time)
        this.visibleTimeWindowDays = 20;
        // Full cycle is 20 workdays, but we'll show more data before/after for context
        this.totalDataDays = 40; // Show 20 workdays before + 20 workdays after current
    }
    
    draw(simulation) {
        // Clear canvas
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw axes
        this.drawAxes();
        
        // Draw grid lines
        this.drawGridLines();
        
        // Draw history
        this.drawHistory(simulation);
        
        // Draw week markers
        this.drawWeekMarkers(simulation);
        
        // Draw current position indicator
        this.drawCurrentIndicator(simulation);
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // Y axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.padding);
        this.ctx.lineTo(this.padding, this.canvas.height - this.padding);
        this.ctx.stroke();
        
        // X axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, this.canvas.height - this.padding);
        this.ctx.lineTo(this.canvas.width - this.padding, this.canvas.height - this.padding);
        this.ctx.stroke();
        
        // Labels
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Time (1 month)', this.canvas.width / 2, this.canvas.height - 10);
        
        this.ctx.save();
        this.ctx.translate(15, this.canvas.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Satisfaction', 0, 0);
        this.ctx.restore();
        
        // Y axis ticks and labels
        this.ctx.textAlign = 'right';
        this.ctx.font = '11px Courier New';
        for (let i = 0; i <= 5; i++) {
            const y = this.canvas.height - this.padding - (i * this.height / 5);
            this.ctx.fillText((i * 20) + '%', this.padding - 10, y + 4);
        }
    }
    
    drawGridLines() {
        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = this.canvas.height - this.padding - (i * this.height / 5);
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, y);
            this.ctx.lineTo(this.canvas.width - this.padding, y);
            this.ctx.stroke();
        }
        
        this.ctx.setLineDash([]);
    }
    
    drawHistory(simulation) {
        if (simulation.cycleHistory.length < 2) return;
        
        const history = simulation.cycleHistory;
        const maxValue = simulation.monthAmplitude + simulation.weekAmplitude + simulation.dayAmplitude;
        const minValue = -(maxValue);
        const range = maxValue - minValue;
        
        // Current time in the cycle (0-30 days, repeating)
        const currentTimeDays = simulation.currentTime % simulation.workdaysPerMonth;
        
        // Draw line
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // First pass: draw the line and collect segments for fill
        const lineSegments = []; // array of arrays, each sub-array is a continuous segment
        let currentSegment = [];
        let lastWasOnScreen = false;
        
        this.ctx.beginPath();
        
        for (let i = 0; i < history.length; i++) {
            // Get actual time from history
            const timeDays = simulation.timeHistory[i] || 0;
            
            // Calculate the actual time difference from current time
            // This is NOT modulo - we use actual time to prevent wrap-around artifacts
            const offsetFromCurrent = timeDays - simulation.currentTime;
            
            // Only consider data that's within the visible time window (15 days on each side)
            if (Math.abs(offsetFromCurrent) > this.visibleTimeWindowDays / 2) {
                // Data is too old or too far in future, skip it
                if (lastWasOnScreen && currentSegment.length > 0) {
                    lineSegments.push(currentSegment);
                    currentSegment = [];
                }
                lastWasOnScreen = false;
                continue;
            }
            
            // Map to screen coordinates (center = middle of screen)
            const x = this.padding + this.width / 2 + (offsetFromCurrent / this.visibleTimeWindowDays) * this.width;
            
            // Check if within visible range on screen
            const isOnScreen = x > this.padding && x < this.canvas.width - this.padding;
            
            if (isOnScreen) {
                const normalizedValue = (history[i] - minValue) / range;
                const y = this.canvas.height - this.padding - (normalizedValue * this.height);
                
                currentSegment.push({ x, y });
                
                if (!lastWasOnScreen) {
                    // Starting a new segment
                    this.ctx.moveTo(x, y);
                } else {
                    // Continuing current segment
                    this.ctx.lineTo(x, y);
                }
                lastWasOnScreen = true;
            } else {
                // Point is off-screen
                if (lastWasOnScreen && currentSegment.length > 0) {
                    // End of a segment
                    lineSegments.push(currentSegment);
                    currentSegment = [];
                }
                lastWasOnScreen = false;
            }
        }
        
        // Don't forget the last segment
        if (currentSegment.length > 0) {
            lineSegments.push(currentSegment);
        }
        
        this.ctx.stroke();
        
        // Draw filled area under curve with vertical drops
        this.ctx.fillStyle = 'rgba(44, 62, 80, 0.1)';
        
        // Draw fill for each continuous segment
        for (let segment of lineSegments) {
            if (segment.length > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(segment[0].x, segment[0].y);
                for (let i = 1; i < segment.length; i++) {
                    this.ctx.lineTo(segment[i].x, segment[i].y);
                }
                
                // Draw down from last point
                this.ctx.lineTo(segment[segment.length - 1].x, this.canvas.height - this.padding);
                
                // Draw along bottom axis
                this.ctx.lineTo(segment[0].x, this.canvas.height - this.padding);
                
                // Close path back to start
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
    }
    
    drawCurrentIndicator(simulation) {
        if (simulation.cycleHistory.length === 0) return;
        
        const maxValue = simulation.monthAmplitude + simulation.weekAmplitude + simulation.dayAmplitude;
        const minValue = -(maxValue);
        const range = maxValue - minValue;
        
        // Current time is always at the center of the screen
        const x = this.padding + this.width / 2;
        
        const currentValue = simulation.calculateSatisfaction(simulation.currentTime).total;
        const normalizedValue = (currentValue - minValue) / range;
        const y = this.canvas.height - this.padding - (normalizedValue * this.height);
        
        // Draw indicator circle
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Border
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Vertical line to time axis
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([3, 3]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, this.canvas.height - this.padding);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawWeekMarkers(simulation) {
        // Draw vertical dotted lines at the end of each workweek (every Friday)
        // Fridays occur at times 5, 10, 15, 20, 25, 30, 35, 40, etc. (every 5 days continuously)
        
        const halfWindow = this.visibleTimeWindowDays / 2;
        
        // Find which multiples of 5 are visible in the current window
        // Current window ranges from (currentTime - halfWindow) to (currentTime + halfWindow)
        const windowStart = simulation.currentTime - halfWindow;
        const windowEnd = simulation.currentTime + halfWindow;
        
        // Find the first Friday at or after windowStart
        const firstFridayIndex = Math.ceil(windowStart / 5);
        const lastFridayIndex = Math.floor(windowEnd / 5);
        
        // Draw each Friday in the visible range
        for (let fridayIndex = firstFridayIndex; fridayIndex <= lastFridayIndex; fridayIndex++) {
            const fridayTime = fridayIndex * 5;
            const offsetFromCurrent = fridayTime - simulation.currentTime;
            
            // Map to screen coordinates
            const x = this.padding + this.width / 2 + (offsetFromCurrent / this.visibleTimeWindowDays) * this.width;
            
            // Only draw if within visible area
            if (x > this.padding && x < this.canvas.width - this.padding) {
                // Check if this is also a payday (every 20 days)
                const isPayday = (fridayTime % 20) === 0;
                
                if (isPayday) {
                    // Payday: solid line, darker color
                    this.ctx.strokeStyle = '#666';
                    this.ctx.lineWidth = 2;
                    this.ctx.setLineDash([]);
                } else {
                    // Regular Friday: dotted line, lighter color
                    this.ctx.strokeStyle = '#999';
                    this.ctx.lineWidth = 1;
                    this.ctx.setLineDash([2, 3]);
                }
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.padding);
                this.ctx.lineTo(x, this.canvas.height - this.padding);
                this.ctx.stroke();
                
                // Draw label below the x-axis
                this.ctx.setLineDash([]); // Clear dash for text
                this.ctx.fillStyle = isPayday ? '#666' : '#999';
                this.ctx.font = isPayday ? 'bold 10px Courier New' : '10px Courier New';
                this.ctx.textAlign = 'center';
                const labelText = isPayday ? 'Pay' : 'Fri';
                this.ctx.fillText(labelText, x, this.canvas.height - this.padding + 15);
            }
        }
        
        this.ctx.setLineDash([]);
    }
}
