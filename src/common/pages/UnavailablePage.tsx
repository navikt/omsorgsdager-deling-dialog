import React from 'react';

interface Props {
    contentRenderer?: () => React.ReactNode;
}
const UnavailablePage = ({ contentRenderer }: Props) => (
    <div>{contentRenderer ? contentRenderer() : <>Applikasjon er ikke tilgjengelig</>}</div>
);

export default UnavailablePage;
