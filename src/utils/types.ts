import { Idl, Instruction, Accounts, } from '@coral-xyz/anchor';

export interface IdlMetadata {
  address: string;
  name: string;
  version: string;
  spec: string;
  description: string;
}

export interface IdlType extends Omit<Idl, 'instructions'> {
  metadata: IdlMetadata;
  instructions: Array<Instruction & {
    discriminator: number[];
    accounts: Accounts[];
    args: { name: string; type: string }[];
  }>;
  accounts?: [];
}

export interface Agent {
  game: string;
  ipfsHash: string;
  name: string;
  symbol: string;
  uri: string;
  modelHash: string;
}