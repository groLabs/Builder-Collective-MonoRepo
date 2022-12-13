import { useHistory } from "react-router";

export function useIsApprove() {
    const history = useHistory()
    return (
      history.location.pathname.includes("collective-approve") ||
      history.location.pathname.includes("collective-launched")
    );
}