# opendiagram-[sm2r]-synchronise-mysql-2-redis
Node.js server to synchronise data between MetaX and Redis for lightning fast access to MetaX Semantics

**Intended use:**
In-memory calls from odPortal

**Current status:**
Alpha release works as intended, it's expected to add more synchronization tasks in future. These could be added to synchro-map.js by adding SELECT string and appropriate callback function for Redis synchronization.

**Configuration:**
Configuration of Servers and overall behavior is accessible  via configuration.js (attributes are self-explanatory).

**Run:**
1. clone repo
2. change configuration.js
3. run command: "node ./server/app.js"

**Stop:**
Server runs in terminal window. There are two ways to stop synchronization server:
A. This option enables to stop server remotely: Connect to Redis DB and change "signal_stop" key to "true"
B. This is local only option: Press Ctrl+C 
