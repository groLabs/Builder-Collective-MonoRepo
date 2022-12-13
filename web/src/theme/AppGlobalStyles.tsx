/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { CssBaseline, GlobalStyles } from '@mui/material';

export function AppGlobalStyles(): React.ReactElement {
    return (
        <React.Fragment>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    '*, *::before, *::after': {
                        boxSizing: 'border-box',
                    },

                    '*, button:focus': {
                        outline: 'none',
                    },

                    a: {
                        '&:hover': {
                            textDecoration: 'none',
                        },
                    },

                    // Keep the scroll bar for consistency in all screens
                    body: {
                        overflowY: 'scroll !important' as any,
                    },

                    // Hide input number arrows
                    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                        margin: 0,
                        WebkitAppearance: 'none',
                    },

                    // Firefox Hide input number arrows
                    'input[type=number]': {
                        MozAppearance: 'textfield',
                    },
                }}
            />
        </React.Fragment>
    );
}
