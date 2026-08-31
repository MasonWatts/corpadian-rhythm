/**
 * Corpadian Rhythm Simulation
 * Models three rotating linkages representing month, week, and day cycles
 */

class CorpadianSimulation {
    constructor() {
        // Time parameters (in simulated workdays)
        this.currentTime = 0; // in workdays
        this.workdaysPerMonth = 20; // 4 weeks × 5 days
        this.workdaysPerWeek = 5; // Mon-Fri only
        this.hoursPerDay = 8; // 9-5 workday
        
        // Arm parameters (lengths in pixels)
        this.monthArmLength = 100;
        this.weekArmLength = 70;
        this.dayArmLength = 50;
        
        // Amplitudes for the sine wave contributions
        this.monthAmplitude = 100;
        this.weekAmplitude = 50;
        this.dayAmplitude = 25;
        
        // Time scaling for animation
        this.timeMultiplier = 1.0;
        
        // Starting position: beginning of month
        this.cycleHistory = [];
        this.timeHistory = []; // Track time for each history entry
        this.maxHistoryLength = 1000;
    }
    
    /**
     * Get the phase angle for each arm
     * Month: 1 rotation per month (30 days)
     * Week: cycles with 5-day workweek (6 complete cycles per 30 days)
     * Day: 5 rotations per week arm rotation (5 per workday cycle)
     */
    getArmAngles(time) {
        // Month: 1 rotation per 20 workdays (one complete work month)
        const monthFraction = (time % this.workdaysPerMonth) / this.workdaysPerMonth;
        
        // Week: 4 rotations per 20 workdays (one rotation per 5-day workweek)
        const weekFraction = (time * 4 % this.workdaysPerMonth) / this.workdaysPerMonth;
        
        // Day: 20 rotations per 20 workdays (one rotation per workday)
        const dayFraction = (time * 20 % this.workdaysPerMonth) / this.workdaysPerMonth;
        
        return {
            month: monthFraction * Math.PI * 2,
            week: weekFraction * Math.PI * 2,
            day: dayFraction * Math.PI * 2,
        };
    }
    
    /**
     * Calculate the position of each linkage joint
     */
    getLinkagePositions(time) {
        const angles = this.getArmAngles(time);
        const center = { x: 0, y: 0 };
        
        // Month arm endpoint
        const monthEnd = {
            x: this.monthArmLength * Math.cos(angles.month - Math.PI / 2),
            y: this.monthArmLength * Math.sin(angles.month - Math.PI / 2),
        };
        
        // Week arm starts at month arm's end
        const weekEnd = {
            x: monthEnd.x + this.weekArmLength * Math.cos(angles.week - Math.PI / 2),
            y: monthEnd.y + this.weekArmLength * Math.sin(angles.week - Math.PI / 2),
        };
        
        // Day arm starts at week arm's end
        const dayEnd = {
            x: weekEnd.x + this.dayArmLength * Math.cos(angles.day - Math.PI / 2),
            y: weekEnd.y + this.dayArmLength * Math.sin(angles.day - Math.PI / 2),
        };
        
        return {
            center,
            monthEnd,
            weekEnd,
            dayEnd,
        };
    }
    
    /**
     * Calculate the "satisfaction" value
     */
    calculateSatisfaction(time) {
        const monthFraction = (time % this.workdaysPerMonth) / this.workdaysPerMonth;
        const weekFraction = (time * 4 % this.workdaysPerMonth) / this.workdaysPerMonth;
        const dayFraction = (time * 20 % this.workdaysPerMonth) / this.workdaysPerMonth;
        
        const monthAngle = monthFraction * Math.PI * 2;
        const weekAngle = weekFraction * Math.PI * 2;
        const dayAngle = dayFraction * Math.PI * 2;
        
        const monthComponent = Math.sin(monthAngle + Math.PI / 2) * this.monthAmplitude;
        const weekComponent = Math.sin(weekAngle + Math.PI / 2) * this.weekAmplitude;
        const dayComponent = Math.sin(dayAngle + Math.PI / 2) * this.dayAmplitude;
        
        const total = monthComponent + weekComponent + dayComponent;
        const maxTotal = this.monthAmplitude + this.weekAmplitude + this.dayAmplitude;
        
        return {
            total,
            month: monthComponent,
            week: weekComponent,
            day: dayComponent,
            normalized: (total + maxTotal) / (2 * maxTotal)
        };
    }
    
    /**
     * Get human-readable time display
     * Time cycles through workweeks (Mon-Fri, 9-5)
     */
    getTimeDisplay(time) {
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        
        // time is in workdays, and we cycle every 20 workdays
        // Workday number: 1-20
        const workdayNumber = Math.floor(time % this.workdaysPerMonth) + 1;
        
        // Which day of the week (0-4 for Mon-Fri)
        const dayOfWeek = Math.floor(time % this.workdaysPerWeek);
        
        // Time within current workday (fractional part of time, 0-1)
        const dayProgress = time % 1;
        const hour = 9 + dayProgress * this.hoursPerDay;
        const minute = Math.floor((hour % 1) * 60);
        const displayHour = Math.floor(hour);
        const ampm = displayHour >= 12 ? 'PM' : 'AM';
        const displayHourAMPM = displayHour % 12 || 12;
        
        return {
            dayOfMonth: workdayNumber,
            dayName: dayNames[dayOfWeek % this.workdaysPerWeek],
            formatted: `Day ${workdayNumber} (${dayNames[dayOfWeek % this.workdaysPerWeek]}), ${displayHourAMPM}:${minute.toString().padStart(2, '0')} ${ampm}`
        };
    }
    
    /**
     * Update simulation
     */
    update(deltaTime = 1/60) {
        this.currentTime += deltaTime * this.timeMultiplier;
        
        const satisfaction = this.calculateSatisfaction(this.currentTime);
        this.cycleHistory.push(satisfaction.total);
        this.timeHistory.push(this.currentTime);
        
        if (this.cycleHistory.length > this.maxHistoryLength) {
            this.cycleHistory.shift();
            this.timeHistory.shift();
        }
    }
    
    /**
     * Reset simulation
     */
    reset() {
        this.currentTime = 0;
        this.cycleHistory = [];
        this.timeHistory = [];
    }
    
    /**
     * Set speed multiplier
     */
    setSpeed(multiplier) {
        this.timeMultiplier = multiplier;
    }
}
