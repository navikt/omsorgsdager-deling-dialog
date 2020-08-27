import React from 'react';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';

const LoadPoster = () => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: '15rem',
            alignItems: 'center',
        }}>
        <LoadingSpinner type="XXL" />
    </div>
);

export default LoadPoster;
