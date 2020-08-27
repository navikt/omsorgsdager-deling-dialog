import React from 'react';

interface Props {
    contentRenderer?: () => React.ReactNode;
}
const UnknownPage = ({ contentRenderer }: Props) => <div>{contentRenderer ? contentRenderer() : <>Ukjent side</>}</div>;

export default UnknownPage;
