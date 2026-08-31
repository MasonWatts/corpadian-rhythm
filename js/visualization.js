/**
 * Visualization for the linkage mechanism
 */

class LinkageVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // High-DPI canvas setup for crisp text rendering
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.getAttribute('width');
        const displayHeight = this.canvas.getAttribute('height');
        
        // Store display dimensions for later reference
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        this.canvas.style.width = displayWidth + 'px';
        this.canvas.style.height = displayHeight + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        this.centerX = displayWidth / 2;
        this.centerY = displayHeight / 2;
    }
    
    draw(simulation) {
        const positions = simulation.getLinkagePositions(simulation.currentTime);
        
        // Clear canvas
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);
        
        // Draw grid
        this.drawGrid();
        
        // Draw arms
        this.drawArm(
            this.centerX + positions.center.x,
            this.centerY + positions.center.y,
            this.centerX + positions.monthEnd.x,
            this.centerY + positions.monthEnd.y,
            '#e74c3c',
            'Month',
            4
        );
        
        this.drawArm(
            this.centerX + positions.monthEnd.x,
            this.centerY + positions.monthEnd.y,
            this.centerX + positions.weekEnd.x,
            this.centerY + positions.weekEnd.y,
            '#27ae60',
            'Week',
            3
        );
        
        this.drawArm(
            this.centerX + positions.weekEnd.x,
            this.centerY + positions.weekEnd.y,
            this.centerX + positions.dayEnd.x,
            this.centerY + positions.dayEnd.y,
            '#3498db',
            'Day',
            2
        );
        
        // Draw joints
        this.drawJoint(this.centerX + positions.center.x, this.centerY + positions.center.y, '#333', 6);
        this.drawJoint(this.centerX + positions.monthEnd.x, this.centerY + positions.monthEnd.y, '#c0392b', 5);
        this.drawJoint(this.centerX + positions.weekEnd.x, this.centerY + positions.weekEnd.y, '#229954', 5);
        this.drawJoint(this.centerX + positions.dayEnd.x, this.centerY + positions.dayEnd.y, '#2980b9', 5);
        
        // Draw end node
        // const satisfaction = simulation.calculateSatisfaction(simulation.currentTime);
        // const normalizedSat = satisfaction.normalized;
        // const nodeColor = this.getColorForValue(normalizedSat);
        // this.drawEndNode(
        //     this.centerX + positions.dayEnd.x,
        //     this.centerY + positions.dayEnd.y,
        //     nodeColor,
        //     normalizedSat
        // );
        
        // Draw reference lines
        this.drawReferenceLine();
    }
    
    drawArm(x1, y1, x2, y2, color, label, width) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    drawJoint(x, y, color, radius) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e8e8e8';
        this.ctx.lineWidth = 1;
        
        const gridSize = 20;
        
        for (let x = 0; x < this.displayWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.displayHeight);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.displayHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.displayWidth, y);
            this.ctx.stroke();
        }
    }
    
    drawReferenceLine() {
        // Draw center crosshairs
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 30, this.centerY);
        this.ctx.lineTo(this.centerX + 30, this.centerY);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY - 30);
        this.ctx.lineTo(this.centerX, this.centerY + 30);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    getColorForValue(normalizedValue) {
        // Red for low, yellow for medium, green for high
        if (normalizedValue < 0.33) {
            return '#e74c3c'; // Red
        } else if (normalizedValue < 0.66) {
            return '#f39c12'; // Orange
        } else {
            return '#27ae60'; // Green
        }
    }
}
