use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("The provided collection ID does not match the expected collection.")]
    CollectionIdMismatch,
}
