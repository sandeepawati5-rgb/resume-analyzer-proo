
import React, { useState, useCallback, useMemo } from 'react';
import { generateAnalysis } from './services/geminiService';
import { FileUploadIcon, BriefcaseIcon, CheckCircleIcon, LightbulbIcon, SparklesIcon, AlertTriangleIcon, SearchIcon, LogOutIcon } from './components/Icons';
import { AnalysisResult } from './types';
import ScoreDisplay from './components/ScoreDisplay';
import ResultCard from './components/ResultCard';
import LoginPage from './components/LoginPage';
import { demoData } from './data/demoData';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const [resumeText, setResumeText] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [demoAnalysis, setDemoAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setResumeText('');
        setJobDescription('');
        setFileName(null);
        setAnalysis(null);
        setDemoAnalysis(null);
        setError(null);
        setIsLoading(false);
        setIsLoggedIn(false);
    };

    const isAnalyzeDisabled = useMemo(() => {
        return !resumeText || !jobDescription || isLoading;
    }, [resumeText, jobDescription, isLoading]);

    const extractTextFromFile = useCallback(async (file: File) => {
        if (file.type === 'application/pdf') {
            try {
                const pdfjsLib = (window as any).pdfjsLib;
                if (!pdfjsLib) {
                    throw new Error('pdf.js library not loaded.');
                }
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
                }
                return fullText;
            } catch (e) {
                console.error("Error processing PDF:", e);
                setError('Failed to process the PDF file. Please ensure it is a valid PDF.');
                return '';
            }
        } else if (file.type === 'text/plain') {
            return file.text();
        } else {
            setError('Unsupported file type. Please upload a PDF or TXT file.');
            return '';
        }
    }, []);

    const handleFileChange = useCallback(async (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            setResumeText('');
            setError(null);
            setAnalysis(null);
            setDemoAnalysis(null);
            const text = await extractTextFromFile(file);
            setResumeText(text);
        }
    }, [extractTextFromFile]);

    const handleAnalyze = async () => {
        if (isAnalyzeDisabled) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setDemoAnalysis(null);

        try {
            const result = await generateAnalysis(resumeText, jobDescription);
            setAnalysis(result);
        } catch (e) {
            console.error(e);
            setError('Failed to get analysis from AI. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, isOver: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(isOver);
    };
    
    const handleShowDemo = (role: keyof typeof demoData) => {
        setAnalysis(null);
        setError(null);
        setDemoAnalysis(demoData[role]);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const displayData = analysis || demoAnalysis;

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="relative text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                        AI Resume Analyzer
                    </h1>
                    <p className="text-lg text-slate-400">
                        Get instant feedback to tailor your resume for your dream job.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="absolute top-0 right-0 mt-2 flex items-center gap-2 bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                        aria-label="Logout"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-8">
                        {/* Resume Upload */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <FileUploadIcon className="w-6 h-6 mr-3 text-cyan-400" />
                                1. Upload Your Resume
                            </h2>
                            <label
                                onDragEnter={(e) => handleDragEvents(e, true)}
                                onDragLeave={(e) => handleDragEvents(e, false)}
                                onDragOver={(e) => handleDragEvents(e, true)}
                                onDrop={(e) => {
                                    handleDragEvents(e, false);
                                    handleFileChange(e.dataTransfer.files);
                                }}
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${dragOver ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800'}`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                                    <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs">PDF or TXT</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => handleFileChange(e.target.files)} />
                            </label>
                            {fileName && (
                                <div className="mt-4 text-center bg-slate-700/50 py-2 px-4 rounded-md text-sm text-green-400">
                                    File loaded: <span className="font-medium text-white">{fileName}</span>
                                </div>
                            )}
                        </div>

                        {/* Job Description */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <BriefcaseIcon className="w-6 h-6 mr-3 text-cyan-400" />
                                2. Paste Job Description
                            </h2>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => {
                                    setJobDescription(e.target.value);
                                    setDemoAnalysis(null);
                                }}
                                placeholder="Paste the full job description here..."
                                className="w-full h-48 bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 text-slate-300 placeholder-slate-500"
                            />
                        </div>
                    </div>

                    {/* Action and Output Section */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 shadow-lg flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <SparklesIcon className="w-6 h-6 mr-3 text-cyan-400" />
                            3. Get AI Analysis
                        </h2>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzeDisabled}
                            className={`w-full py-3 px-6 font-bold text-lg rounded-lg transition-all duration-300 flex items-center justify-center gap-3
                                ${isAnalyzeDisabled 
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
                            {isLoading && <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>}
                        </button>
                        
                        {error && (
                            <div className="mt-6 bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg flex items-center">
                                <AlertTriangleIcon className="w-5 h-5 mr-3" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="mt-6 flex-grow overflow-y-auto pr-2 -mr-2" style={{maxHeight: 'calc(100vh - 20rem)'}}>
                            {isLoading && (
                                <div className="space-y-4 animate-pulse">
                                    <div className="w-40 h-40 bg-slate-700 rounded-full mx-auto"></div>
                                    <div className="h-6 bg-slate-700 rounded-md w-3/4 mx-auto"></div>
                                    <div className="h-20 bg-slate-700 rounded-md"></div>
                                    <div className="h-20 bg-slate-700 rounded-md"></div>
                                </div>
                            )}

                            {displayData && !isLoading && (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <ScoreDisplay score={displayData.matchScore} />
                                        <h3 className="text-xl font-bold mt-2 text-white">Overall Match Score</h3>
                                    </div>
                                    <ResultCard title="Summary" icon={<SparklesIcon />}>
                                        <p className="text-slate-300">{displayData.summary}</p>
                                    </ResultCard>
                                    <ResultCard title="Strengths" icon={<CheckCircleIcon />}>
                                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                                            {displayData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </ResultCard>
                                     <ResultCard title="Missing Keywords" icon={<SearchIcon />}>
                                        <div className="flex flex-wrap gap-2">
                                            {displayData.missingKeywords.map((kw, i) => (
                                                <span key={i} className="bg-yellow-900/50 text-yellow-300 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>
                                            ))}
                                        </div>
                                    </ResultCard>
                                    <ResultCard title="Improvements" icon={<LightbulbIcon />}>
                                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                                            {displayData.improvements.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </ResultCard>
                                </div>
                            )}

                            {!displayData && !isLoading && !error && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                    <SparklesIcon className="w-16 h-16 mb-4" />
                                    <p className="text-lg">Your analysis will appear here.</p>
                                    <p>Fill in the details and click "Analyze".</p>
                                    
                                    <div className="mt-12 w-full border-t border-slate-700 pt-8">
                                        <h4 className="font-semibold text-slate-400 mb-4 text-center">Not sure where to start?</h4>
                                        <p className="text-sm text-slate-500 mb-4 text-center">See an example analysis for different roles.</p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button 
                                                onClick={() => handleShowDemo('softwareEngineer')} 
                                                className="bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                                            >
                                                Software Engineer Example
                                            </button>
                                            <button 
                                                onClick={() => handleShowDemo('productManager')} 
                                                className="bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                                            >
                                                Product Manager Example
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;