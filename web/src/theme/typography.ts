import { ThemeOptions } from '@mui/material';
import { coreThemeConstants } from './coreThemeConstants';

export const typography: ThemeOptions["typography"] = {
  body1: {
    fontWeight: 400,
    fontSize: "1rem",
    letterSpacing: coreThemeConstants.letterSpacing.xs,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  body2: {
    fontWeight: 500,
    fontSize: "1rem",
    letterSpacing: coreThemeConstants.letterSpacing.xs,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  body2Small: {
    fontSize: "0.875rem",
    fontWeight: 400,
    letterSpacing: coreThemeConstants.letterSpacing.xs,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  fontFamily: coreThemeConstants.fontFamily,
  fontWeightBold: 600,
  fontWeightLight: 300,
  fontWeightMedium: 500,
  fontWeightRegular: 400,
  h1: {
    /**
     * h1 in design
     * Used for
     * - title in ProductCard
     * - Apy value in ProductCard
     * - title in protocol-position block
     */
    fontSize: "3.75",
    fontWeight: 700,
    letterSpacing: coreThemeConstants.letterSpacing.xs,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  h2: {
    /**
     * h2 in design
     * Used for
     * - amount in small AmountDetail
     * - Alert titles
     */
    fontSize: "1.5rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.sm,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  h3: {
    /**
     * h3 in design
     * Used for
     * - Secondary headers in below fold content
     */
    fontSize: "3rem",
    fontWeight: 400,
    letterSpacing: coreThemeConstants.letterSpacing.md,
    lineHeight: "56.02px",
  },
  h3Large: {
    /**
     * h3 in design
     * Used for
     * - Secondary headers in below fold content
     */
    fontSize: "1.875rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.md,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  h4: {
    /**
     * Used for
     * - large feature text on product home pages
     */
    fontSize: "1rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.lg,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  h5: {
    /**
     * Used for
     * - main title of scenes,
     */
    fontSize: "1.75rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.md,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  h6: {
    fontSize: "1.25rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.sm,
    lineHeight: '32px',
  },
  labsSmall: {
    fontSize: "0.75rem",
  },
  nav: {
    fontSize: "0.875rem",
    fontWeight: 400,
    letterSpacing: coreThemeConstants.letterSpacing.sm,
    lineHeight: coreThemeConstants.lineHeight.md,
  },
  navSub: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: coreThemeConstants.letterSpacing.md,
    // lineHeight: '1rem',
  },
};
