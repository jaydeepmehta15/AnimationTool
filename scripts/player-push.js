var cp = require('child_process')
var path = require('path')
var ROOT = path.join(__dirname, '..')

cp.execSync(`node ./scripts/semver.js --non-interactive`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/build-player.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/upload-cdn-player.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git add --all .`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git commit -m "auto: Semver update"`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/publish-player.js`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`node ./scripts/git-subproj-sync.js --package=haiku-player`, { cwd: ROOT, stdio: 'inherit' })