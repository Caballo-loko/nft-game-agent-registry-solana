import { Program, web3 } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

export const useMintAIAgent = () => {
  const { publicKey } = useWallet();

  const mintAIAgent = async (
    program: Program,
    id: number,
    name: string,
    symbol: string,
    uri: string,
    game: string,
    modelHash: string
  ) => {
    if (!publicKey) throw new Error("Wallet not connected");

    const [mintPda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('mint'), Buffer.from(id.toString())],
      program.programId
    );

    try {
      const tx = await program.methods
        .mintAiAgent(id, name, symbol, uri, game, modelHash)
        .accounts({
          authority: publicKey,
          payer: publicKey,
          mint: mintPda,
          // Add other necessary accounts here
        })
        .rpc();

      console.log('AI Agent NFT minted:', tx);
      return tx;
    } catch (error) {
      console.error('Error minting AI Agent NFT:', error);
      throw error;
    }
  };

  return mintAIAgent;
};