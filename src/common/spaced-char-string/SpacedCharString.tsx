import React from 'react';

export const stringToSpacedCharString = (str: string) => {
    return (str || '').split('').join(' ');
};

interface Props {
    str: string;
}

const SpacedCharString = ({ str }: Props) => <span aria-label={stringToSpacedCharString(str)}>{str}</span>;

export default SpacedCharString;
