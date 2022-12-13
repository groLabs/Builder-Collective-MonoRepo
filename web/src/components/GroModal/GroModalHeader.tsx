/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { css } from '@emotion/react';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';

type GroModalHeaderTypes = {
    allowBack?: boolean;
    children?: React.ReactNode;
    hideClose?: boolean;
    onBack?: () => void;
    onClose: () => void;
    title?: React.ReactNode;
};

export function GroModalHeader({
    hideClose,
    allowBack,
    onBack = (): void => {},
    onClose,
    ...props
}: GroModalHeaderTypes): React.ReactElement {
    const theme = useTheme();
    const isXsSize = false
    const styles = {
        buttonBackWrapper: css`
            cursor: pointer;
            position: absolute;
            left: ${theme.spacing(2)};
            top: ${theme.spacing(3)};
        `,
        buttonClose: css`
            &:hover {
                stroke: ${theme.palette.grey[200]};
            }
            stroke: ${theme.palette.common.white};
        `,
        buttonCloseWrapper: css`
            cursor: pointer;
            position: absolute;
            right: ${theme.spacing(isXsSize ? 2 : 3)};
            top: ${theme.spacing(3)};
            color: ${theme.palette.grey[100]}
        `,
        headerBand: css`
            height: 52px;
        `,
    };

    return (
        <div>
            <div css={styles.headerBand}>
                {props.title}
                {!!allowBack && (
                    <div css={styles.buttonBackWrapper} onClick={onBack}>
                        <ChevronLeftOutlinedIcon
                            height={isXsSize ? 20 : 16}
                            width={isXsSize ? 20 : 16}
                        />
                    </div>
                )}
                {!hideClose && (
                    <div css={styles.buttonCloseWrapper} onClick={onClose}>
                        <CloseIcon
                            css={styles.buttonClose}
                            height={isXsSize ? 20 : 16}
                            width={isXsSize ? 20 : 16}
                        />
                    </div>
                )}
            </div>
            <div>{props.children}</div>
        </div>
    );
}
