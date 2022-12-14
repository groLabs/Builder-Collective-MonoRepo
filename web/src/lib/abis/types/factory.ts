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

export type LogBuilderContractUpdated = ContractEventLog<{
  _implementation: string;
  _version: string;
  0: string;
  1: string;
}>;
export type LogNewBuilderProxyDeployed = ContractEventLog<{
  _clone: string;
  _deployer: string;
  0: string;
  1: string;
}>;
export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;

export interface Factory extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Factory;
  clone(): Factory;
  methods: {
    createNewBuilder(
      _dataPayload: string | number[]
    ): PayableTransactionObject<string>;

    implementationContract(): NonPayableTransactionObject<string>;

    implementationVersion(): NonPayableTransactionObject<string>;

    owner(): NonPayableTransactionObject<string>;

    proxies(arg0: number | string | BN): NonPayableTransactionObject<string>;

    proxyInfo(arg0: string): NonPayableTransactionObject<string>;

    renounceOwnership(): NonPayableTransactionObject<void>;

    setImplementationContract(
      _implementation: string,
      _implementationVersion: string
    ): NonPayableTransactionObject<void>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;
  };
  events: {
    LogBuilderContractUpdated(
      cb?: Callback<LogBuilderContractUpdated>
    ): EventEmitter;
    LogBuilderContractUpdated(
      options?: EventOptions,
      cb?: Callback<LogBuilderContractUpdated>
    ): EventEmitter;

    LogNewBuilderProxyDeployed(
      cb?: Callback<LogNewBuilderProxyDeployed>
    ): EventEmitter;
    LogNewBuilderProxyDeployed(
      options?: EventOptions,
      cb?: Callback<LogNewBuilderProxyDeployed>
    ): EventEmitter;

    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(
    event: "LogBuilderContractUpdated",
    cb: Callback<LogBuilderContractUpdated>
  ): void;
  once(
    event: "LogBuilderContractUpdated",
    options: EventOptions,
    cb: Callback<LogBuilderContractUpdated>
  ): void;

  once(
    event: "LogNewBuilderProxyDeployed",
    cb: Callback<LogNewBuilderProxyDeployed>
  ): void;
  once(
    event: "LogNewBuilderProxyDeployed",
    options: EventOptions,
    cb: Callback<LogNewBuilderProxyDeployed>
  ): void;

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;
}
