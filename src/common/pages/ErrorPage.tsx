import React from 'react';

interface Props {
    contentRenderer?: () => React.ReactNode;
}
const ErrorPage = ({ contentRenderer }: Props) => <div>{contentRenderer ? contentRenderer() : <>Feilside</>}</div>;

export default ErrorPage;
