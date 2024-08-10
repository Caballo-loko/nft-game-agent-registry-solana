// src/instructions/mod.rs

pub mod create_collection;
pub mod mint_ai_agent;

// Re-export the relevant structs and enums for easier access
pub use create_collection::*;
pub use mint_ai_agent::*;