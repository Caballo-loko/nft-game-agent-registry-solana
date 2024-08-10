use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;
use state::*;
use errors::*;

declare_id!("65uoqzGsfRmqsnzeJ85Z7Ayd8cZECWNpXTxuwSatLuXk");

#[program]
pub mod nft_game_agent_program {
    use super::*;

    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        symbol: String,
    ) -> Result<()> {
        instructions::create_collection::handler(ctx, name, symbol)
    }

    pub fn mint_ai_agent(
        ctx: Context<MintAIAgent>,
        id: Pubkey,
        name: String,
        symbol: String,
        uri: String,
        game: String,
        model_hash: String,
        collection_id: u8,
    ) -> Result<()> {
        instructions::mint_ai_agent::handler(ctx, id, name, symbol, uri, game, model_hash, collection_id)
    }
}