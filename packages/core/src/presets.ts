export interface QualityPreset {
    quality: number;
    fastMode: boolean;
    description: string;
}

export const QUALITY_PRESETS: Record<string, QualityPreset> = {
    web: {
        quality: 75,
        fastMode: true,
        description: 'Optimized for web delivery'
    },
    print: {
        quality: 90,
        fastMode: false,
        description: 'High quality for printing'
    },
    archive: {
        quality: 95,
        fastMode: false,
        description: 'Maximum quality for archival'
    },
    thumbnail: {
        quality: 60,
        fastMode: true,
        description: 'Small file size for thumbnails'
    },
    balanced: {
        quality: 85,
        fastMode: false,
        description: 'Balance between quality and size'
    }
};

export function getPreset(name: string): QualityPreset {
    const preset = QUALITY_PRESETS[name.toLowerCase()];
    if (!preset) {
        throw new Error(`Unknown preset: ${name}. Available: ${Object.keys(QUALITY_PRESETS).join(', ')}`);
    }
    return preset;
}
