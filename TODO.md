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
- Complete home page

# SafeGuard Server
- ~~Check if the key if it's being used~~
- ~~Check if the player is banned~~
- ~~Check if the joining player is whitelisted~~
- ~~Implement server subscription duration (SafeGuard master server side)~~
- ~~Check SafeGuard Agent disconnect~~
- ~~Check if the player disconnected from MTA:SA server~~
- ~~Check SafeGuard server status~~
- Inject Anticheat scripts components to the client
- Implement HTTP communication encryption
- Implement SafeGuard Server watermark on server name

# SafeGuard Agent
- ~~Implement UI (with ImGui)~~
- ~~Malicious Tools checking~~
- ~~Hide PEB Agent~~
- ~~Check if the server is online~~
- SSL Verification
- VM Verification
- Implement HTTP communication encryption

# SafeGuard Engine
- ~~HWID Checks~~
- ~~Malicious Tools checking~~
- ~~Memory scan Pulse (with network sync)~~
- ~~MTA:SA Anticheat components verification~~
- ~~Player warn~~
- ~~Validate HWID~~
- HWID Caching
- Implement HTTP communication encryption

# Engine Integrity Checks
- Malicious Windows driver names verification
- Check for Fivem plugins in plugins folder
- Hook LdrLoadDLL and LdrUnloadDLL
- Check for unauthorized modules and unsigned modules
- DLL cloaking checks:
  - Search for unregistred IAT
  - Search for packed sections by the packer's name
  - Determine whether the thread base wasn't in any module range
