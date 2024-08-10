import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Idl } from "@coral-xyz/anchor";

describe("nft-game-agent-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AiAgentNftProgram as Program<Idl>;

  it("Creates a collection and mints an AI Agent NFT", async () => {
    // First, create a collection
    const collectionName = "Test Collection";
    const collectionSymbol = "TEST";
    
    const [collectionPDA, collectionBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("collection"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods.createCollection(collectionName, collectionSymbol)
      .accounts({
        collection: collectionPDA,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Then, mint an AI Agent NFT
    const id = anchor.web3.Keypair.generate().publicKey;
    const name = "AI Agent";
    const symbol = "AIA";
    const uri = "http://localhost:8000/metadata.json"; // Update to local URI
    const game = "Mortal Kombat";
    const modelHash = "somehash";

    const [mint, mintBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("mint"), id.toBuffer()],
      program.programId
    );

    const tokenAccount = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: provider.wallet.publicKey,
    });

    const metadataProgramId = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

    const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        mint.toBuffer(),
      ],
      metadataProgramId
    );

    const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadataProgramId.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      metadataProgramId
    );

    const tx = await program.methods.mintAiAgent(
      id,
      name,
      symbol,
      uri,
      game,
      modelHash,
      collectionBump // Pass the collection bump as collection_id
    ).accounts({
      authority: provider.wallet.publicKey,
      payer: provider.wallet.publicKey,
      mint: mint,
      tokenAccount,
      associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      metadataProgram: metadataProgramId,
      metadata,
      masterEdition,
      collection: collectionPDA,
    }).rpc();

    console.log("Mint transaction signature", tx);
  });
});