
import React from 'react';

interface ResultCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => {
    return (
        <div className="bg-slate-900/70 p-5 rounded-lg border border-slate-700">
            <h4 className="text-lg font-bold mb-3 flex items-center text-cyan-300">
                <span className="w-6 h-6 mr-3">{icon}</span>
                {title}
            </h4>
            <div>{children}</div>
        </div>
    );
};

export default ResultCard;