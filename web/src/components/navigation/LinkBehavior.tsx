/* eslint-disable react/display-name */
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type PpLinkBehavior = Omit<RouterLinkProps, 'to'> & {
    href: RouterLinkProps['to'];
};

// See: https://mui.com/guides/routing/#global-theme-link
export const LinkBehavior = React.forwardRef<HTMLAnchorElement, PpLinkBehavior>(
    // eslint-disable-next-line react/prop-types
    ({ href, ...other }, ref) => (
        // Map href (Material-UI) -> to (react-router)
        <RouterLink ref={ref} to={href} {...other} />
    ),
);
