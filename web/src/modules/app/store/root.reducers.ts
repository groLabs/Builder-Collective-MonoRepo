import { combineReducers } from 'redux';
import { walletReducer } from '../../wallet/store/wallet.reducers';
import { scCreatorReducer } from "../../scCreator/store/scCreator.reducer";
import { initialWalletState } from '../../wallet/store/wallet.store';
import { initialScCreatorState } from "../../scCreator/store/scCreator.store";
import { initialExchangeState } from '../../exchange/store/exchange.store';
import { initialCollectiveState } from '../../collectives/store/collectives.store';
import { exchangeReducer } from '../../exchange/store/exchange.reducer';
import { collectiveReducer } from '../../collectives/store/collectives.reducer';

export const rootReducer = combineReducers({
    wallet: walletReducer,
    scCreator: scCreatorReducer,
    exchange: exchangeReducer,
    collectives: collectiveReducer
});

export const rootInitialState = {
    wallet: initialWalletState,
    scCreator: initialScCreatorState,
    exchange: initialExchangeState,
    collectives: initialCollectiveState
};
