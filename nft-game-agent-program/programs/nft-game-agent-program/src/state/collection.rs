// programs/nft-game-agent-program/src/state/collection.rs
use anchor_lang::prelude::*;

#[account]
pub struct Collection {
    pub name: [u8; 32],
    pub symbol: [u8; 10],
    pub collection_id: u8, // Changed from Pubkey to u8 to match the bump
}
