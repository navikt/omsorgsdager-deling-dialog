export enum Feature {
    'KORONA_2021_PERIODE_ENABLED' = 'KORONA_2021_PERIODE_ENABLED',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
