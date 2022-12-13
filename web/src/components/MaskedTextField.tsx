/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import React from "react";
import { CleaveOptions } from "cleave.js/options";
import Cleave from "cleave.js/react";

type CleaveInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  CleaveOptions & {
    inputRef?: React.ComponentProps<typeof Cleave>["htmlRef"];
    options?: CleaveOptions;
  };

export function MaskedTextField({
  inputRef,
  options,
  ...props
}: CleaveInputProps): React.ReactElement {
  return (
    // @ts-ignore
    <Cleave {...props} htmlRef={inputRef} options={options || {}} />
  );
}
