import { getBidPblancListInfoCnstwk } from '../src/services/bidPublicInfoService.js';
import { setServiceKey } from '../src/services/api.js';

// Mocking environment for node execution if needed, or just run with node
// But since service files use import/export, I need to use a module aware runner or just copy paste relevant parts if running with node directly.
// Easier: Create a proper test file that I can run with `node` by importing from the file if package.json has "type": "module".
// package.json has "type": "module" ? Let's check `package.json` first.
