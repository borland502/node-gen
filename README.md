# node-gen
Generate new node projects using Taskfile

## Tasks

```console
task: Available tasks for this project:
* express-gen-ts:       Creates a new express application, updates eslint, and opens the project in an IDE
```

```shell
task --list
```
```shell
task express-gen-ts
```
#### Details
```shell
task express-gen-ts --summary
```

## Scripts

Scripts use typescript on top of the zx runtime, avoiding the explicit transpilation step
to module JS.  This quirk requires a shebang `#!/usr/bin/env -S npx tsx` to run as a script: There are
other ways to [accomplish the same thing](https://www.codejam.info/2023/04/zx-typescript-esm.html).  All scripts
use a `.mts` file extension.

Most scripts like `ide.mts` are snippets in service to a [taskfile](https://taskfile.dev/).

```typescript
#!/usr/bin/env -S npx tsx

import {echo, which} from "zx"
import {exit} from "process"

const ideExecs = ["webstorm","code"]

for (const ide of ideExecs) {
    if ((await which(ide, {nothrow: true}) != null)) {
        echo(ide)
        exit(0)
    }
}

exit(1)
```

This snippet populates the dynamic task variable `IDE`

```yaml
vars:
  IDE:
    sh: "{{.ROOT_DIR}}/scripts/ide.mts"
```