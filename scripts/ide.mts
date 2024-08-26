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