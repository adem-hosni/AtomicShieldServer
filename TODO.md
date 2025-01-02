# Authentication
- ~~Implement Authentication Middleware~~
- ~~Add captcha to the authentication~~
- ~~Protect admin dashboard~~

# Dashboard
- ~~Add refresh server key functionality~~
- ~~Integrating Server Creation with active subscriptions~~
- ~~Add Subscriptions Section~~
- ~~Add Quick Setup Section~~
- ~~Add Whitelist view~~
- ~~Add "whitelist add" functionality~~
- ~~Add whitelist actions~~
- ~~Add Server Edit action~~
- ~~Add Discord Webhook Logs~~
- ~~Add Disable bans functionality~~
- ~~Add Reset Configurations button~~
- ~~Add 404 Page Not Found Page~~
- SSL Verification
- Complete home page

# Fivem Server
- ~~Check if the key if it's being used~~
- ~~Check if the player is banned~~
- ~~Implement server subscription duration (SafeGuard master server side)~~
- ~~Check SafeGuard Scanner disconnect~~
- ~~Check if the player disconnected from Fivem server~~
- ~~Check SafeGuard server status~~
- Implement HTTP communication encryption

# SafeGuard Agent
- Rebase imgui design code
- Implement startup option
- Inject engine dll into fivem's process
- Check if the client is already connected
- Check server's status
- Check agent version
- Add some security checks
- Implement HTTP communication encryption

# SafeGuard Engine
- ~~HWID Checks~~
- ~~Malicious Tools checking~~
- ~~Memory scan Pulse (with network sync)~~
- ~~MTA:SA Anticheat components verification~~
- ~~Player warn~~
- ~~Validate HWID~~
- ~~HWID Caching~~
- ~~Check server's response integrity~~
- Implement HTTP communication encryption

# Engine Integrity Checks
- Malicious Windows driver names verification
- ~~Check for Fivem plugins in plugins folder~~
- ~~Verify the driver test signing mode is off~~
- ~~Verify Secure Boot is Enabled~~
- ~~Check for unsigned modules~~
- ~~Protect anticheat threads~~
- ~~Determine whether the thread base wasn't in any module range~~
- ~~Check process in-memory strings~~
- ~~Check process handles~~
- ~~Hide scan process~~
- Hook LdrInitializeThunk to check for the thread module presence (Anti Module Cloaking)
