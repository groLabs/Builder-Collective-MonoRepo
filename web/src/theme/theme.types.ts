/* eslint-disable @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface */
import type { Theme as MUITheme, PaletteColorOptions } from '@mui/material/styles';
import {} from '@emotion/react/types/css-prop';
import { cssMixins } from './cssMixins';

declare module '@mui/material/styles/createPalette' {
    interface TypeText {
        quaternary: string;
        tertiary: string;
    }
}

declare module '@mui/material/styles' {
    interface Theme {
        cssMixins: typeof cssMixins;
    }
    interface ThemeOptions {
        cssMixins: typeof cssMixins;
    }
    interface PaletteColor {
        superDark?: string;
        superLight?: string;
    }
    interface SimplePaletteColorOptions {
        contrastText?: string;
        dark?: string;
        faded?: string;
        light?: string;
        main: string;
        superDark?: string;
        superLight?: string;
    }
    interface Palette {
        alert: SimplePaletteColorOptions;
        default: SimplePaletteColorOptions;
        gro: SimplePaletteColorOptions;
        gvt: SimplePaletteColorOptions;
        pwrd: SimplePaletteColorOptions;
    }
    interface PaletteOptions {
        alert?: PaletteColorOptions;
        default?: PaletteColorOptions;
        gro?: PaletteColorOptions & { faded?: string };
        gvt?: PaletteColorOptions & { faded?: string };
        pwrd?: PaletteColorOptions & { faded?: string };
    }
    interface TypographyVariants {
        body2Small: React.CSSProperties;
        h3Large: React.CSSProperties;
        labsSmall: React.CSSProperties;
        nav: React.CSSProperties;
        navSub: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        body2Small: React.CSSProperties;
        h3Large: React.CSSProperties;
        labsSmall: React.CSSProperties;
        nav: React.CSSProperties;
        navSub: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        body2Small: true;
        h3Large: true;
        labsSmall: true;
        nav: true;
        navSub: true;
        sceneHeader: true;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        alert: PaletteColorOptions | true;
        default: PaletteColorOptions | true;
        gro: PaletteColorOptions | true;
        gvt: PaletteColorOptions | true;
        pwrd: PaletteColorOptions | true;
    }
}

declare module '@emotion/react' {
    export interface Theme extends MUITheme {}
}
