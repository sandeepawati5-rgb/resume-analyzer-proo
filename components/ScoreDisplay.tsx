
import React, { useState, useEffect } from 'react';

interface ScoreDisplayProps {
    score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const animationDuration = 1000;
        const startTime = Date.now();

        const animateScore = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            const currentScore = Math.floor(progress * score);
            setDisplayScore(currentScore);

            if (progress < 1) {
                requestAnimationFrame(animateScore);
            }
        };
        
        requestAnimationFrame(animateScore);
        
        return () => { setDisplayScore(score) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score]);


    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (displayScore / 100) * circumference;

    const scoreColorClass = score > 75 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
    const trackColorClass = score > 75 ? 'stroke-green-400' : score > 50 ? 'stroke-yellow-400' : 'stroke-red-400';
    
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="-rotate-90"
            >
                <circle
                    className="stroke-slate-700"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    className={`${trackColorClass} transition-all duration-1000 ease-out`}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <span className={`absolute text-4xl font-extrabold ${scoreColorClass}`}>
                {displayScore}
            </span>
        </div>
    );
};

export default ScoreDisplay;