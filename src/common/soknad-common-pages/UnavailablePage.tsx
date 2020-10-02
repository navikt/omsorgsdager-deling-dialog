import React from 'react';
import SoknadErrorMessages from '../soknad-error-messages/SoknadErrorMessages';
import ErrorPage from './ErrorPage';

interface Props {
    contentRenderer?: () => React.ReactNode;
}
const UnavailablePage = ({ contentRenderer }: Props) => {
    return (
        <ErrorPage
            contentRenderer={() =>
                contentRenderer ? contentRenderer : () => <SoknadErrorMessages.ApplicationUnavailable />
            }
        />
    );
};

export default UnavailablePage;
