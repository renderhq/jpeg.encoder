import { useState, useCallback, useRef } from 'react';
import { Upload, Download, RefreshCw, Image as ImageIcon, Settings, Info } from 'lucide-react';
import { encodeJPEG, getPreset, QUALITY_PRESETS, JPEGData } from '@jpeg-encoder/core';

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ percent: 0, stage: '' });
    const [stats, setStats] = useState({ originalSize: 0, compressedSize: 0, width: 0, height: 0 });
    const [quality, setQuality] = useState(75);
    const [selectedPreset, setSelectedPreset] = useState('web');

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type.startsWith('image/')) {
            handleFile(droppedFile);
        }
    }, []);

    const handleFile = (f: File) => {
        setFile(f);
        setResultUrl(null);
        setPreviewUrl(URL.createObjectURL(f));
        setStats(prev => ({ ...prev, originalSize: f.size }));
    };

    const processImage = async () => {
        if (!file) return;

        setIsProcessing(true);
        setProgress({ percent: 0, stage: 'Starting...' });

        try {
            // Load image to canvas to get raw pixel data
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise(resolve => img.onload = resolve);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);

            // Encode using our core library
            const result: JPEGData = await encodeJPEG(
                {
                    data: imageData.data,
                    width: imageData.width,
                    height: imageData.height
                },
                {
                    quality,
                    onProgress: (percent, stage) => setProgress({ percent, stage })
                }
            );

            // Create blob from result
            const blob = new Blob([result.buffer], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setStats({
                originalSize: file.size,
                compressedSize: blob.size,
                width: result.width,
                height: result.height
            });

        } catch (err) {
            console.error(err);
            alert('Failed to encode image');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePresetChange = (name: string) => {
        setSelectedPreset(name);
        try {
            const preset = getPreset(name);
            setQuality(preset.quality);
        } catch (e) {
            // custom preset
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
            <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                            <span className="font-bold text-lg">J</span>
                        </div>
                        <span className="font-semibold tracking-tight">JPEG Encoder</span>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com/renderhq/jpeg.encoder" className="text-sm font-medium hover:text-neutral-600 transition-colors">GitHub</a>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Left Column: Upload & Controls */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-serif italic mb-2">Refined Compression.</h1>
                            <p className="text-neutral-500">Professional grade, pure TypeScript JPEG encoding running entirely in your browser.</p>
                        </div>

                        <div
                            onDrop={onDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => document.getElementById('fileInput')?.click()}
                            className={`
                border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all
                ${file ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400 bg-white'}
              `}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                            />

                            {file && previewUrl ? (
                                <div className="relative w-full h-full p-4 group">
                                    <img src={previewUrl} className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-6 h-6 text-neutral-400" />
                                    </div>
                                    <p className="font-medium">Drop an image here</p>
                                    <p className="text-sm text-neutral-400 mt-1">or click to browse</p>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className={`space-y-6 transition-opacity ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-medium uppercase tracking-wider text-neutral-500">Preset</label>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(QUALITY_PRESETS).map(([key, p]) => (
                                        <button
                                            key={key}
                                            onClick={() => handlePresetChange(key)}
                                            className={`
                        px-3 py-2 rounded-lg text-sm font-medium border transition-all
                        ${selectedPreset === key
                                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                                    : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'}
                      `}
                                        >
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setSelectedPreset('custom')}
                                        className={`
                      px-3 py-2 rounded-lg text-sm font-medium border transition-all
                      ${selectedPreset === 'custom'
                                                ? 'bg-neutral-900 text-white border-neutral-900'
                                                : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-600'}
                    `}
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-medium uppercase tracking-wider text-neutral-500">Quality</label>
                                    <span className="font-serif italic text-2xl">{quality}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="100"
                                    value={quality}
                                    onChange={e => {
                                        setQuality(parseInt(e.target.value));
                                        setSelectedPreset('custom');
                                    }}
                                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                                />
                                <p className="text-xs text-neutral-400">
                                    Higher quality means larger file size. 75-85% is usually the sweet spot.
                                </p>
                            </div>

                            <button
                                onClick={processImage}
                                disabled={isProcessing}
                                className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neutral-900/10 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Processing {progress.percent}%</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Encode Image</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Result */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 lg:p-8 flex flex-col h-full">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500 mb-6">Result</h2>

                        {resultUrl ? (
                            <div className="flex-1 flex flex-col">
                                <div className="flex-1 border border-neutral-100 bg-neutral-50 rounded-xl overflow-hidden relative mb-6 flex items-center justify-center">
                                    <img src={resultUrl} className="max-w-full max-h-[400px] object-contain" />
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 bg-neutral-50 rounded-xl">
                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Size</p>
                                        <p className="font-serif text-xl">{(stats.compressedSize / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <div className="p-4 bg-neutral-50 rounded-xl">
                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Reduction</p>
                                        <p className="font-serif text-xl text-green-600">
                                            {Math.round((1 - stats.compressedSize / stats.originalSize) * 100)}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-neutral-50 rounded-xl">
                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Dimensions</p>
                                        <p className="font-serif text-xl">{stats.width}×{stats.height}</p>
                                    </div>
                                </div>

                                <a
                                    href={resultUrl}
                                    download="encoded.jpg"
                                    className="w-full py-3 bg-white border border-neutral-200 rounded-xl font-medium text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download JPEG</span>
                                </a>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
                                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-4">
                                    <ImageIcon className="w-8 h-8 opacity-20" />
                                </div>
                                <p>Encoded result will appear here</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
