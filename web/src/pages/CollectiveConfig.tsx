import React from 'react'
import { CenteredWrapper } from '../components'
import { CollectiveDetails } from '../modules/collectives/components/CollectiveDetails'
import { CollectiveTable } from '../modules/scCreator/components/CollectiveTable/CollectiveTable'

function CollectiveConfig(): React.ReactElement {
    return (
        <CenteredWrapper>
            <CollectiveDetails />
            <CollectiveTable />
        </CenteredWrapper>
    )
}

export default CollectiveConfig