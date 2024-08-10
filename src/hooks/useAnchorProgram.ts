import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../../nft-game-agent-program/target/idl/ai_agent_nft_program.json';

// Define a custom type for your IDL structure
type CustomIdl = Idl & {
  metadata: {
    address: string;
  };
};

const useAnchorProgram = () => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions, signTransaction } = useWallet();

  if (!publicKey || !signAllTransactions || !signTransaction) {
    return null; // Return null if the wallet is not fully connected
  }

  const provider = new AnchorProvider(
    connection,
    {
      publicKey,
      signAllTransactions,
      signTransaction,
    },
    AnchorProvider.defaultOptions()
  );

  // Use the address from the IDL file
  const programId = new PublicKey((idl as CustomIdl).metadata.address);

  // Create the program instance using the provider
  const program = new Program(idl as CustomIdl, programId, provider);

  return program;
};

export default useAnchorProgram;