import React from 'react';
import SoknadErrorMessages from '../soknad-error-messages/SoknadErrorMessages';
import ErrorPage from './ErrorPage';

interface Props {
    contentRenderer?: () => React.ReactNode;
}
const UnknownRoutePage = ({ contentRenderer }: Props) => {
    return (
        <ErrorPage
            contentRenderer={() => (contentRenderer ? contentRenderer() : () => <SoknadErrorMessages.UnknownRoute />)}
        />
    );
};

export default UnknownRoutePage;
