use anchor_lang::prelude::*;

declare_id!("5af9Vm4DsGn33TAvYUfd2A9sCQA2AX8RHwLom5ww6MKj");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        // Get a reference to the account
        let base_account = &mut ctx.accounts.base_account;
        // Initialise total_gifs.
        base_account.total_gifs = 0;
        Ok(())
    }

    // Function to count gifs, accept a gif_link parameter from the user.
    // We also reference the user from the Context
    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> ProgramResult 
    {
        // Get a reference to the account and increment total_gifs.
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // Build the struct
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };

        // Add it to the gif_list vector.
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;
        Ok(())
    }
}

// Attach certain variables to the Initialise content
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space=9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Specify what data to add in AddGif Context. Add the signer who calls the AddGif method to the 
// struct so that we can save it
#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// Create a custom struct for us to work with. 
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

// Tell Solana what we want to store on this account
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>, //documentation at https://doc.rust-lang.org/std/vec/struct.Vec.html
}
