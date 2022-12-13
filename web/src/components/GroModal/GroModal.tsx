/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { css } from '@emotion/react';
import { Dialog } from '@mui/material';

type GroModalTypes = {
    background?: string;
    children?: React.ReactNode;
    enableNavbar?: boolean;
    isOpen: boolean;
    onClose: () => void;
    overflow?: string;
    overflowY?: 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto';
    width?: string;
};

export function GroModal({
    background = 'rgba(0, 0, 0, 0.5)',
    children,
    enableNavbar,
    isOpen,
    onClose,
    overflow,
    overflowY,
    width = '472px',
}: GroModalTypes): React.ReactElement {

    const isLgSize = true
    const isXsSize = false

    const styles = {
        horizontalModal: css`
            & .MuiPaper-root {
                @media (max-height: 500px) {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }
        `,
        modal: css`
            width: ${isLgSize ? 'calc(100% - 188px)' : '100%'};
            left: ${isLgSize ? '188px' : '0'};
            height: ${isLgSize ? '100%' : 'calc(100% - 70px)'};
            top: ${isLgSize ? '0' : '70px'};
            & .MuiBackdrop-root {
                background-color: ${background}
                width: ${isLgSize ? 'calc(100% - 188px)' : '100%'};
                left: ${isLgSize ? '188px' : '0'};
                height: ${isLgSize ? '100%' : 'calc(100% - 80px)'};
                top: ${isLgSize ? '0' : '80px'};
            }
           
        `,
        wrapper: css`
            max-width: 100vw;
            width: ${isXsSize ? '100%' : width};
            height: auto;
            @media (max-width: 600px) or (max-height: 500px) {
                height: 100vh;
                width: 100%;
            }
        `,
    };
    const height = window.innerHeight;

    return (
        <Dialog
            disableScrollLock
            css={enableNavbar ? [styles.modal, styles.horizontalModal] : styles.horizontalModal}
            fullScreen={isXsSize || height < 500}
            maxWidth={false}
            open={isOpen}
            PaperProps={{
                style: {
                    borderRadius: '16px',
                    overflow: overflow || 'inherit',
                    overflowY: overflowY || 'inherit',
                },
            }}
            onClose={onClose}
        >
            <div css={styles.wrapper}>{children}</div>
        </Dialog>
    );
}
