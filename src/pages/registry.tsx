import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import Layout from '../components/Layout';
import idl from '../../nft-game-agent-program/idl.json';
import useAnchorProgram from '../hooks/useAnchorProgram'; // Assume this custom hook exists

interface AgentAccount {
  publicKey: PublicKey;
  account: {
    game: string;
    ipfsHash: string;
  };
}

interface ExampleAgent {
  id: number;
  game: string;
  ipfsHash: string;
  fileType: string;
}

const programID = new PublicKey('CEDHMWhBUqLY3uCjYXLNKBRzyXm2yARfy1tViu7V2BKJ');

export default function Registry() {
  const [agents, setAgents] = useState<AgentAccount[]>([]);
  const [exampleAgents, setExampleAgents] = useState<ExampleAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const wallet = useWallet();
  const program = useAnchorProgram(programID, idl);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!wallet.connected || !wallet.publicKey || !program) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedAgents = await program.account.agent.all() as AgentAccount[];
        setAgents(fetchedAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setError('Failed to fetch agents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [wallet.connected, wallet.publicKey, program]);

  useEffect(() => {
    setExampleAgents([
      { id: 1, game: 'Mortal Kombat', ipfsHash: 'QmX...', fileType: 'pickle' },
      { id: 2, game: 'Street Fighter', ipfsHash: 'QmY...', fileType: 'onnx' },
      { id: 3, game: 'Tekken', ipfsHash: 'QmZ...', fileType: 'pickle' },
    ]);
  }, []);

  const renderAgentList = (agents: AgentAccount[] | ExampleAgent[], isExample: boolean = false) => (
    <ul className="space-y-4">
      {agents.map((agent) => (
        <li key={isExample ? (agent as ExampleAgent).id : (agent as AgentAccount).publicKey.toString()} 
            className="bg-white p-4 rounded-lg shadow">
          <p className="font-bold">Game: {isExample ? (agent as ExampleAgent).game : (agent as AgentAccount).account.game}</p>
          <p>IPFS Hash: {isExample ? (agent as ExampleAgent).ipfsHash : (agent as AgentAccount).account.ipfsHash}</p>
          {isExample && <p>File Type: {(agent as ExampleAgent).fileType}</p>}
        </li>
      ))}
    </ul>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Game Agent Registry</h1>
        {loading && <p className="text-gray-600">Loading agents...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Registered Agents</h2>
            {agents.length > 0 ? renderAgentList(agents) : <p>No agents found.</p>}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Example Agents</h2>
            {renderAgentList(exampleAgents, true)}
          </>
        )}
      </div>
    </Layout>
  );
}