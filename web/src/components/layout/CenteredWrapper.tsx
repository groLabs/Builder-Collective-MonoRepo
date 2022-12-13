import React from "react";
import { css } from "@emotion/react";
import { PpWC } from "../../utilTypes";

type TpCenteredWrapper = {
  noPadding?: boolean;
} & PpWC;

export function CenteredWrapper({
  children,
  noPadding,
}: TpCenteredWrapper): React.ReactElement {


  const wrapper = css`
    width: 1024px;
    margin: 0 auto;
    @media (max-width: 1200px) {
      padding: ${noPadding ? "0px" : "0px 20px"};
    }
  `;

  return <div css={wrapper}>{children}</div>;
}
