import React from 'react';
import { css } from '@emotion/react';
import { CircularProgress, CircularProgressProps, useTheme } from '@mui/material';

type PpLoading = {
    fullScreen?: boolean;
    minHeight?: string;
} & CircularProgressProps;

export function Loading({
    fullScreen = false,
    minHeight = '0px',
    ...circularProps
}: PpLoading): React.ReactElement {
    const theme = useTheme();
    const styles = css`
        ${theme.cssMixins.rowCentered};
        padding: ${theme.spacing(fullScreen ? 5 : 2)};
        min-height: ${fullScreen ? '100vh' : minHeight};
    `;
    return (
        <div css={styles}>
            <CircularProgress color="secondary" {...circularProps} />
        </div>
    );
}
