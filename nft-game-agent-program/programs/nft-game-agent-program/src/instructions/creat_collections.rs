use anchor_lang::prelude::*;
use crate::state::Collection;

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 1)]
    pub collection: Account<'info, Collection>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateCollection>,
    name: String,
    symbol: String,
) -> Result<()> {
    let collection = &mut ctx.accounts.collection;
    collection.name = name;
    collection.symbol = symbol;
    collection.collection_id = ctx.bumps.collection;
    Ok(())
}
