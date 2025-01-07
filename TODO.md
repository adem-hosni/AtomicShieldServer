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
- Show online player
- Validate received HWID caches
- SSL Verification
- Take player screenshot
- Show detection screenshot
- Complete home page

# Fivem Server
- ~~Check if the key if it's being used~~
- ~~Check if the player is banned~~
- ~~Implement server subscription duration (AtomicShield master server side)~~
- Check for engine disconnect
- Check if the player disconnected from Fivem server
- Check AtomicShield server status
- Implement HTTP communication encryption

# AtomicShield Agent
- ~~Rebase imgui design code~~
- ~~Check if the client is already connected~~
- ~~Check server's status~~
- ~~Check agent version~~
- Implement startup option
- ~~Implement HTTP communication encryption~~
- Inject engine dll into fivem's process
- Add some security checks

# AtomicShield Engine
- ~~HWID Checks~~
- ~~Malicious Tools checking~~
- ~~Memory scan Pulse (with network sync)~~
- ~~Player warn~~
- ~~Validate HWID~~
- ~~HWID Caching~~
- ~~Check server's response integrity~~
- Fix imgui transparency issue
- Implement HTTP communication encryption

# Engine Integrity Checks
- ~~Malicious Windows driver names verification~~
- ~~Check for Fivem plugins in plugins folder~~
- ~~Verify the driver test signing mode is off~~
- ~~Verify Secure Boot is Enabled~~
- ~~Check for unsigned modules~~
- ~~Protect anticheat threads~~
- ~~Determine whether the thread base wasn't in any module range~~
- ~~Check process in-memory strings~~
- ~~Check process handles~~
- ~~Hide scan process~~
- ~~Send screenshot with detection report~~
- Send detection report for malicious strings
- Hook LdrInitializeThunk to check for the thread module presence (Anti Module Cloaking)
