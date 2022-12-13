// Disabled because of false-positives
/* eslint-disable no-undef */

/**
 * Type Naming:
 *
 * - General Types: prefix with Tp, e.g. TpConfig
 * - Props: prefix with Pp, e.g. PpErrorPage
 * - Return: prefix with Rn e.g. RnFunctionName
 * - State: prefix with St e.g. StAlerts
 * - Context: prefix with Cx e.g. CxAlertPush
 *
 */

// eslint-disable-next-line @typescript-eslint/ban-types
export type PpWC<P = {}> = P & {
    children: React.ReactNode;
};
