import { ThemeOptions } from '@mui/material';

// Secondary
export const pendingBlueDark = '#1148B2';
export const pendingBlue = '#226BF9';
export const pendingBlueMid = '#4584FF';
export const pendingBlueLight = '#79A5FB';
export const warningRed = '#D01638';
export const warningRedMid = '#E71E44';
export const warningRedLight = '#FF4366';
export const warningRedPastel = '#FF708B';
export const groFaded = '#E8CBFF';
export const pwrdFaded = '#A4DEFF';
export const gvtFaded = '#FFC9C6';
export const backgroundBlue = '#081824';
export const darkBackground = '#0C2436';
export const lightBlue = "#00FFFF";

export const white = '#FFFFFF';
export const black = '#01101C';

export const orange = {
    100: '#FFA979',
    300: '#FF8F51',
    500: '#FD792F',
    700: '#E96216',
};

const yellow = {
    100: '#FFECB0',
    300: '#FFE07E',
    500: '#FFD54F',
    700: '#F8BE28',
};

const grey = {
  100: "rgba(0,0,0,0.6)",
  200: "#6B6B6B",
  300: "#e0e0e0",
  400: "#5E7485",
  600: "#395062",
  700: "#131d38",
  800: "#4A4A4A",
};

const green = {
    100: '#66F8D3',
    200: '#1DE9B6',
    500: '#00CA97',
    700: '#0DBC90',
};

export const blue = {
  50: "#8AD5FF",
  100: "#3DB9FF",
  200: "#0BA7FE",
  300: "#0095E9",
  500: "#0070AF",
  800: "#0C1734",
};

export const red = {
    50: '#FEAEA8',
    100: '#FA8B84',
    200: '#EA726A',
    300: '#E75E55',
    500: '#BC4E46',
    800: '#472D33',
};

export const purple = {
    100: '#DEB8FC',
    200: '#C476FF',
    300: '#B452FF',
    500: '#9D3BE8',
    800: '#651C9C',
};

export const paletteCore: ThemeOptions["palette"] = {
  alert: {
    contrastText: black,
    dark: yellow[700],
    light: yellow[300],
    main: yellow[500],
  },
  background: {
    default: white,
    paper: white,
  },
  common: {
    black,
    white,
  },
  default: {
    contrastText: black,
    dark: white,
    light: white,
    main: white,
  },
  divider: grey[600],
  error: {
    dark: warningRed,
    light: warningRedPastel,
    main: warningRedLight,
  },
  grey,
  gro: {
    contrastText: white,
    dark: purple[800],
    faded: groFaded,
    light: purple[300],
    main: purple[500],
    superLight: purple[200],
  },
  gvt: {
    contrastText: black,
    dark: red[500],
    faded: gvtFaded,
    light: red[200],
    main: red[300],
    superDark: red[800],
    superLight: red[100],
  },
  info: {
    contrastText: black,
    dark: pendingBlue,
    light: pendingBlueLight,
    main: pendingBlueMid,
    superDark: darkBackground,
    superLight: blue[50],
  },
  mode: "dark",
  primary: {
    dark: backgroundBlue,
    main: pendingBlue,
  },
  pwrd: {
    contrastText: black,
    dark: blue[500],
    faded: pwrdFaded,
    light: blue[200],
    main: blue[300],
    superDark: blue[800],
    superLight: blue[100],
  },
  secondary: {
    contrastText: black,
    dark: grey[100],
    main: white,
  },
  success: {
    dark: green[700],
    light: green[100],
    main: "#2E7D32",
  },
  text: {
    primary: black,
    quaternary: grey[400],
    secondary: grey[100],
    tertiary: grey[200],
  },
  warning: {
    contrastText: black,
    dark: orange[700],
    light: orange[100],
    main: orange[500],
    superLight: yellow[100],
  },
};
