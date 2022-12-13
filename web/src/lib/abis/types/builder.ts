/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Approval = ContractEventLog<{
  owner: string;
  spender: string;
  amount: string;
  0: string;
  1: string;
  2: string;
}>;
export type LogNewAdmin = ContractEventLog<{
  newAdmin: string;
  0: string;
}>;
export type LogNewCollectiveInitialized = ContractEventLog<{
  namesOfParticipants: string[];
  tokens: string[];
  price: string[];
  users: string[];
  targets: string[];
  cliff: string;
  vestingTime: string;
  0: string[];
  1: string[];
  2: string[];
  3: string[];
  4: string[];
  5: string;
  6: string;
}>;
export type LogNewPoolInitialized = ContractEventLog<{
  time: string;
  0: string;
}>;
export type LogTokensClaimed = ContractEventLog<{
  user: string;
  share: string;
  tokens: string[];
  amounts: string[];
  0: string;
  1: string;
  2: string[];
  3: string[];
}>;
export type LogTokensStaked = ContractEventLog<{
  user: string;
  _assetValue: string;
  _depositedShare: string;
  _lastCheckpointTWAP: string;
  _lastCheckpointTime: string;
  _lastCheckpointPercentageVested: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}>;
export type LogTokensUnstaked = ContractEventLog<{
  user: string;
  _assetValue: string;
  _unstakedShare: string;
  _lastCheckpointTWAP: string;
  _lastCheckpointTime: string;
  _lastCheckpointPercentageVested: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}>;
export type Transfer = ContractEventLog<{
  from: string;
  to: string;
  amount: string;
  0: string;
  1: string;
  2: string;
}>;

export interface Builder extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Builder;
  clone(): Builder;
  methods: {
    BP(): NonPayableTransactionObject<string>;

    DOMAIN_SEPARATOR(): NonPayableTransactionObject<string>;

    PERMIT_TYPEHASH(): NonPayableTransactionObject<string>;

    VEST_MULTIPLIER(): NonPayableTransactionObject<string>;

    admin(): NonPayableTransactionObject<string>;

    allowance(arg0: string, arg1: string): NonPayableTransactionObject<string>;

    approve(
      spender: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    balanceOf(arg0: string): NonPayableTransactionObject<string>;

    calculateShareToClaim(_staker: string): NonPayableTransactionObject<string>;

    cancel(_to: string): NonPayableTransactionObject<void>;

    claim(): NonPayableTransactionObject<string>;

    collectiveInfo(): NonPayableTransactionObject<{
      vestingTime: string;
      cliff: string;
      collectiveStart: string;
      0: string;
      1: string;
      2: string;
    }>;

    decimals(): NonPayableTransactionObject<string>;

    getClaimable(_staker: string): NonPayableTransactionObject<string[]>;

    getVestingPercent(): NonPayableTransactionObject<string>;

    initialize(
      _namesOfParticipants: string[],
      _collectiveInfo: [
        number | string | BN,
        number | string | BN,
        number | string | BN
      ],
      _tokens: string[],
      _prices: (number | string | BN)[],
      _users: string[],
      _targets: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    lastCheckpoint(): NonPayableTransactionObject<string>;

    lastTWAP(): NonPayableTransactionObject<string>;

    name(): NonPayableTransactionObject<string>;

    namesOfParticipants(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    noOfTokens(): NonPayableTransactionObject<string>;

    nonces(arg0: string): NonPayableTransactionObject<string>;

    permit(
      owner: string,
      spender: string,
      value: number | string | BN,
      deadline: number | string | BN,
      v: number | string | BN,
      r: string | number[],
      s: string | number[]
    ): NonPayableTransactionObject<void>;

    pokeApproval(): NonPayableTransactionObject<boolean[]>;

    readToken(_tokenId: number | string | BN): NonPayableTransactionObject<{
      0: string;
      1: [string, string, string];
    }>;

    releaseFactor(): NonPayableTransactionObject<string>;

    stake(_assetValue: number | string | BN): NonPayableTransactionObject<void>;

    startCollective(): NonPayableTransactionObject<void>;

    symbol(): NonPayableTransactionObject<string>;

    tokenInfo(arg0: string): NonPayableTransactionObject<{
      target: string;
      price: string;
      user: string;
      0: string;
      1: string;
      2: string;
    }>;

    tokens(arg0: number | string | BN): NonPayableTransactionObject<string>;

    totalAssets(): NonPayableTransactionObject<string>;

    totalStaked(): NonPayableTransactionObject<string>;

    totalSupply(): NonPayableTransactionObject<string>;

    transfer(
      to: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    transferFrom(
      from: string,
      to: string,
      amount: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    unstake(
      _assetValueLeft: number | string | BN
    ): NonPayableTransactionObject<void>;

    unstakeAll(): NonPayableTransactionObject<void>;

    unstakeWithoutClaim(
      _assetValueLeft: number | string | BN
    ): NonPayableTransactionObject<void>;

    updateAdmin(_newAdmin: string): NonPayableTransactionObject<void>;

    userInfo(arg0: string): NonPayableTransactionObject<{
      depositedShare: string;
      lastCheckpointTWAP: string;
      lastCheckpointTime: string;
      lastCheckpointPercentageVested: string;
      0: string;
      1: string;
      2: string;
      3: string;
    }>;
  };
  events: {
    Approval(cb?: Callback<Approval>): EventEmitter;
    Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter;

    LogNewAdmin(cb?: Callback<LogNewAdmin>): EventEmitter;
    LogNewAdmin(
      options?: EventOptions,
      cb?: Callback<LogNewAdmin>
    ): EventEmitter;

    LogNewCollectiveInitialized(
      cb?: Callback<LogNewCollectiveInitialized>
    ): EventEmitter;
    LogNewCollectiveInitialized(
      options?: EventOptions,
      cb?: Callback<LogNewCollectiveInitialized>
    ): EventEmitter;

    LogNewPoolInitialized(cb?: Callback<LogNewPoolInitialized>): EventEmitter;
    LogNewPoolInitialized(
      options?: EventOptions,
      cb?: Callback<LogNewPoolInitialized>
    ): EventEmitter;

    LogTokensClaimed(cb?: Callback<LogTokensClaimed>): EventEmitter;
    LogTokensClaimed(
      options?: EventOptions,
      cb?: Callback<LogTokensClaimed>
    ): EventEmitter;

    LogTokensStaked(cb?: Callback<LogTokensStaked>): EventEmitter;
    LogTokensStaked(
      options?: EventOptions,
      cb?: Callback<LogTokensStaked>
    ): EventEmitter;

    LogTokensUnstaked(cb?: Callback<LogTokensUnstaked>): EventEmitter;
    LogTokensUnstaked(
      options?: EventOptions,
      cb?: Callback<LogTokensUnstaked>
    ): EventEmitter;

    Transfer(cb?: Callback<Transfer>): EventEmitter;
    Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Approval", cb: Callback<Approval>): void;
  once(event: "Approval", options: EventOptions, cb: Callback<Approval>): void;

  once(event: "LogNewAdmin", cb: Callback<LogNewAdmin>): void;
  once(
    event: "LogNewAdmin",
    options: EventOptions,
    cb: Callback<LogNewAdmin>
  ): void;

  once(
    event: "LogNewCollectiveInitialized",
    cb: Callback<LogNewCollectiveInitialized>
  ): void;
  once(
    event: "LogNewCollectiveInitialized",
    options: EventOptions,
    cb: Callback<LogNewCollectiveInitialized>
  ): void;

  once(
    event: "LogNewPoolInitialized",
    cb: Callback<LogNewPoolInitialized>
  ): void;
  once(
    event: "LogNewPoolInitialized",
    options: EventOptions,
    cb: Callback<LogNewPoolInitialized>
  ): void;

  once(event: "LogTokensClaimed", cb: Callback<LogTokensClaimed>): void;
  once(
    event: "LogTokensClaimed",
    options: EventOptions,
    cb: Callback<LogTokensClaimed>
  ): void;

  once(event: "LogTokensStaked", cb: Callback<LogTokensStaked>): void;
  once(
    event: "LogTokensStaked",
    options: EventOptions,
    cb: Callback<LogTokensStaked>
  ): void;

  once(event: "LogTokensUnstaked", cb: Callback<LogTokensUnstaked>): void;
  once(
    event: "LogTokensUnstaked",
    options: EventOptions,
    cb: Callback<LogTokensUnstaked>
  ): void;

  once(event: "Transfer", cb: Callback<Transfer>): void;
  once(event: "Transfer", options: EventOptions, cb: Callback<Transfer>): void;
}
