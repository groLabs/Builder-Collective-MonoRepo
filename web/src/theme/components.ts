/**
 * This file can be used to override default props and styles on the various Material components
 * see: https://mui.com/customization/theme-components/
 */
import { alertClasses, alpha, Theme, ThemeOptions } from "@mui/material";
import { LinkBehavior } from "../components";
import { coreThemeConstants } from "./coreThemeConstants";

export function components(theme: Theme): ThemeOptions["components"] {
  return {
    MuiAlert: {
      styleOverrides: {
        icon: {
          marginRight: theme.spacing(2),
        },
        outlinedInfo: {
          [`.${alertClasses.message}`]: {
            padding: 0,
          },
          borderColor: theme.palette.grey[700],
          padding: theme.spacing(2),
        },
        root: {
          [`&.no-icon .${alertClasses.icon}`]: { display: "none" },
        },
        standardWarning: {
          background: theme.palette.grey[700],
          color: theme.palette.text.primary,
          fontSize: "1rem",
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontSize: "20px",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.MuiCheckbox-colorDefault.Mui-checked": {
            color: theme.palette.default.main,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: theme.spacing(5),
          paddingRight: theme.spacing(5),
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        dd: {
          margin: 0,
        },
        dl: {
          margin: 0,
        },
        dt: {
          margin: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
        },
      },
    },
    MuiDrawer: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        paper: {
          borderRight: "none",
          width: theme.cssMixins.appDrawerWidth,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        // @ts-expect-error some awkward typescript error
        component: LinkBehavior, // See: https://mui.com/guides/routing/#global-theme-link
      },
      styleOverrides: {
        root: {
          // could be removed once we stop using reboot.scss from bootstrap
          "&:hover": {
            color: "inherit",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: "wave",
      },
      styleOverrides: {
        text: {
          borderRadius: "2px",
          display: "inline",
          height: "1em",
          padding: "0 2em",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          display: "flex",
          height: 16,
          padding: 0,
          width: 28,
        },
        switchBase: {
          "&.Mui-checked": {
            "& + .MuiSwitch-track": {
              backgroundColor: theme.palette.grey[200],
              borderColor: theme.palette.grey[200],
              opacity: 1,
            },
            color: theme.palette.common.black,
            transform: "translateX(12px)",
          },
          color: theme.palette.grey[200],
          padding: 2,
        },
        thumb: {
          boxShadow: "none",
          height: 12,
          width: 12,
        },
        track: {
          backgroundColor: "transparent",
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 16 / 2,
          opacity: 1,
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        body: {
          borderBottom: "none",
        },
        head: theme.typography.h3,
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            background: "rgba(0, 0, 0, 0.12)",
            color: "rgba(0, 0, 0, 0.26)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: theme.palette.common.white,
          height: "1px",
        },
        root: {
          "& .MuiTab-root": {
            "&.Mui-selected": {
              color: theme.palette.common.white,
            },

            color: alpha(theme.palette.common.white, 0.5),

            fontSize: "1rem",

            letterSpacing: coreThemeConstants.letterSpacing.md,

            marginRight: "32px",

            minWidth: 0,

            padding: theme.spacing(2, 2.5, 2, 2),
            // '&:first-of-type': {
            //     paddingLeft: theme.spacing(0),
            // },
            // '&:last-child': {
            //     paddingRight: theme.spacing(1),
            // },
            paddingLeft: 0,
            paddingRight: 0,
            textTransform: "none",
          },
          "&.MuiTabs-indicator": {
            backgroundColor: theme.palette.common.white,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[600],
          borderRadius: "3px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        // Default State
        notchedOutline: {
          borderColor: "rgba(0, 0, 0, 0.23)",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          "&.MuiTypography-gutterBottom": {
            marginBottom: "2rem",
          },
        },
        h3: {
          "&.MuiTypography-gutterBottom": {
            marginBottom: "1rem",
          },
        },
        h6: {
          "&.MuiTypography-gutterBottom": {
            marginBottom: "2rem",
          },
        },
      },
    },
  };
}
