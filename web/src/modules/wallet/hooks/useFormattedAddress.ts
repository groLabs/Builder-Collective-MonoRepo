import { useEffect, useState } from "react";
import { getENS } from "../../../lib/web3/ens";
import { splitAddress } from "../../../utils";

export function useFormatedAddress(account = ""): string {
  const [formattedAddress, setFormattedAddress] = useState("");

  async function fetchAddressName(address: string): Promise<void> {
    try {
      if (!address) {
        return;
      }

      const ens = await getENS(address);
      setFormattedAddress(ens);
    } catch (e) {
      setFormattedAddress(splitAddress(address));
    }
  }

  useEffect(() => {
    void fetchAddressName(account);
  }, [account]);

  return formattedAddress;
}


// 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC