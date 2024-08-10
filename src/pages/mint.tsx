import React, { useState } from 'react';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TOKEN_METADATA_PROGRAM_ID } from '../utils/constants';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import idl from '../../nft-game-agent-program/target/idl/ai_agent_nft_program.json';
import { IdlType } from '../utils/types';



const useAnchorProgram = () => {
  const { connection } = useConnection();
  const { publicKey, signAllTransactions, signTransaction } = useWallet();

  if (!publicKey || !signAllTransactions || !signTransaction) {
    return null;
  }

  const provider = new AnchorProvider(
    connection,
    { publicKey, signAllTransactions, signTransaction },
    AnchorProvider.defaultOptions()
  );

  const programId = new PublicKey((idl as IdlType).metadata.address);
  const program = new Program(idl as IdlType, programId, provider);

  return program;
};

export default useAnchorProgram;

const MintPage = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    symbol: '',
    uri: '',
    game: '',
    ipfsHash: '',
  });
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wallet = useWallet();
  const program = useAnchorProgram();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value.trim()) {
        setError(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleMint = async () => {
    if (!wallet.publicKey) {
      setError('Wallet not connected');
      return;
    }

    if (!validateInputs()) return;

    setMinting(true);
    setError(null);

    try {
      const programID = program.programId;
      const { id, name, symbol, uri, game, ipfsHash } = formData;

      const mintPublicKey = await PublicKey.createWithSeed(wallet.publicKey, id.toString(), programID);
      const tokenAccount = (await PublicKey.findProgramAddress(
        [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      ))[0];

      const metadata = await getMetadataPDA(mintPublicKey);
      const masterEdition = await getMasterEditionPDA(mintPublicKey);

      const tx = await program.methods
        .mintAiAgent(id, name, symbol, uri, game, ipfsHash)
        .accounts({
          authority: wallet.publicKey,
          payer: wallet.publicKey,
          mint: mintPublicKey,
          tokenAccount,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadataProgram: TOKEN_METADATA_PROGRAM_ID,
          metadata,
          masterEdition,
        })
        .signers([])
        .rpc();

      console.log('Transaction signature', tx);
      alert('AI Agent NFT minted successfully!');
    } catch (err) {
      setError(`Minting failed: ${(err as Error).message}`);
    } finally {
      setMinting(false);
    }
  };

  const getMetadataPDA = async (mint: PublicKey): Promise<PublicKey> => {
    return (await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  };

  const getMasterEditionPDA = async (mint: PublicKey): Promise<PublicKey> => {
    return (await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Mint AI Agent NFT</h1>
      {Object.entries(formData).map(([key, value]) => (
        <input
          key={key}
          type="text"
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
      ))}
      <button
        onClick={handleMint}
        disabled={minting}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {minting ? 'Minting...' : 'Mint'}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default MintPage;