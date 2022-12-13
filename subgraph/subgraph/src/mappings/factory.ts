import { BuidlCollective } from '../../generated/templates';
import { LogNewBuilderProxyDeployed } from '../../generated/Factory/BuidlerFactory';


export function handleNewProxy(event: LogNewBuilderProxyDeployed): void {
    BuidlCollective.create(event.params._clone);
}
