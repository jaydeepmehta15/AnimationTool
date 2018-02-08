const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 1000) // Disk writes happen on a 500ms interval
}

tape('ActiveComponent.prototype.instantiateComponent[1](design)', (t) => {
  t.plan(9)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      t.ok(ac0, 'ac present')
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        t.error(err, 'no err upon instantiation')
        t.equal(info.center.x, 0, 'info center is returned')
        t.equal(mana.attributes.source, 'designs/Path.svg', 'rel source is in mana attribute')
        const timeline = ac0.getReifiedBytecode().timelines.Default['haiku:' + mana.attributes['haiku-id']]
        t.deepEqual(timeline, { 
          viewBox: { '0': { value: '0 0 99 69' } },
          'style.position': { '0': { value: 'absolute' } },
          'style.margin': { '0': { value: '0' } },
          'style.padding': { '0': { value: '0' } },
          'style.border': { '0': { value: '0' } },
          'sizeAbsolute.x': { '0': { value: 99 } },
          'sizeMode.x': { '0': { value: 1 } },
          'sizeAbsolute.y': { '0': { value: 69 } },
          'sizeMode.y': { '0': { value: 1 } },
          'style.zIndex': { '0': { value: 1 } }
        }, 'timeline is ok')
        const subtemplate = ac0.getReifiedBytecode().template.children[0]
        t.equal(subtemplate.attributes['haiku-id'], mana.attributes['haiku-id'], 'template id ok')
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
            t.error(err, 'no err fetching code')
            t.equal(contents.length, 5979, 'checksum of file ok')
            fse.removeSync(folder)
            t.ok(true)
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.deleteComponent[1](design)', (t) => {
  t.plan(9)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'delete-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        t.equal(ac0.getReifiedBytecode().template.children.length,1,'has one child')
        t.equal(ac0.getReifiedBytecode().template.children[0].attributes['haiku-id'],mana.attributes['haiku-id'],'instantiatee id correct')
        return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
          t.error(err, 'no err reading file after inst')
          const lines = contents.split('\n')
          t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place')
          return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
            t.error(err, 'no err deleting')
            t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
            return waitUntilFileProbablyWroteToDisk(() => {
              return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                t.error(err, 'no err reading file after del')
                const lines = contents.split('\n')
                t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place at line 0')
                fse.removeSync(folder)
                t.ok(true)
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[1](design)', (t) => {
  t.plan(4)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
            if (err) throw err
            t.ok(contents1)
            fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_2) // Other one
            return ac0.mergeDesigns({ 'designs/Path.svg': true }, { from: 'test' }, (err) => {
              if (err) throw err
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                  if (err) throw err
                  t.ok(contents2)
                  const diffs = []
                  const lines1 = contents1.split('\n')
                  const lines2 = contents2.split('\n')
                  lines1.forEach((line, index) => {
                    if (line !== lines2[index]) {
                      diffs.push([line, lines2[index]])
                    }
                  })
                  t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:ebc62ccbd93d\": {","      \"haiku:3b44d80a8299\": {"],["      \"haiku:8c15a67d997b\": {","      \"haiku:3eecbd51025f\": {"],["        foobar: { \"0\": { value: \"url(#abc123-0d1946)\" } },","        foobar: { \"0\": { value: \"url(#abc123-18d91c)\" } },"],["        stroke: { \"0\": { value: \"#979797\" } },","        stroke: { \"0\": { value: \"#AAAAAA\" } },"],["        \"translation.x\": { \"0\": { value: -283 } },","        \"translation.x\": { \"0\": { value: -200 } },"],["        \"translation.y\": { \"0\": { value: -254 } }","        \"translation.y\": { \"0\": { value: -500 } }"],["      \"haiku:56e206e430cd\": {","      \"haiku:612fcb0edaf1\": {"],["            value: \"M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125\"","            value: \"M300.000001,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125\""],["            attributes: { \"haiku-id\": \"6a61fbbd8828\" },","            attributes: { \"haiku-id\": \"a93d5abeca66\" },"],["                attributes: { \"haiku-id\": \"8bebbd132401\", id: \"abc123-0d1946\" },","                attributes: { \"haiku-id\": \"f39304a9c030\", id: \"abc123-18d91c\" },"],["            attributes: { \"haiku-id\": \"ebc62ccbd93d\", id: \"Page-1\" },","            attributes: { \"haiku-id\": \"3b44d80a8299\", id: \"Page-1\" },"],["                attributes: { \"haiku-id\": \"8c15a67d997b\", id: \"Artboard\" },","                attributes: { \"haiku-id\": \"3eecbd51025f\", id: \"Artboard\" },"],["                    attributes: { \"haiku-id\": \"56e206e430cd\", id: \"Path-4\" },","                    attributes: { \"haiku-id\": \"612fcb0edaf1\", id: \"Path-4\" },"]]))
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[2](design)', (t) => {
  t.plan(2)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-design-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Circle.svg'), CIRCLE_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Circle.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
            if (err) throw err
            fse.outputFileSync(path.join(folder, 'designs/Circle.svg'), CIRCLE_SVG_2) // Other one
            return ac0.mergeDesigns({ 'designs/Circle.svg': true }, { from: 'test' }, (err) => {
              if (err) throw err
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                  if (err) throw err
                  const diffs = []
                  const lines1 = contents1.split('\n')
                  const lines2 = contents2.split('\n')
                  lines1.forEach((line, index) => {
                    if (line !== lines2[index]) {
                      diffs.push([line, lines2[index]])
                    }
                  })
                  t.equal(JSON.stringify(diffs), JSON.stringify([
                    [ '      "haiku:527ffa2aea92": {',
                      '      "haiku:78ae69ba3b81": {' ],
                    [ '      "haiku:dcce2c8bee2b": {',
                      '      "haiku:29d88e03452f": {' ],
                    [ '        "stop-color": { "0": { value: "#EEEEEE" } },',
                      '        "stop-color": { "0": { value: "#D13434" } },' ],
                    [ '      "haiku:5d53452f8b57": {',
                      '      "haiku:40de3f487875": {' ],
                    [ '      "haiku:0d7370f8eeb0": {',
                      '      "haiku:d82e2d033926": {' ],
                    [ '      "haiku:86d10d02313c": {',
                      '      "haiku:2fd45ce513fd": {' ],
                    [ '        "stop-color": { "0": { value: "#C8C8C8" } },',
                      '        "stop-color": { "0": { value: "#4F78EC" } },' ],
                    [ '      "haiku:1e1099328958": {',
                      '      "haiku:6235d0cbb13d": {' ],
                    [ '      "haiku:40792f5327a9": {',
                      '      "haiku:a8b57a26d6c5": {' ],
                    [ '        x: { "0": { value: "-1.3%" } },',
                      '        x: { "0": { value: "-5.1%" } },' ],
                    [ '        y: { "0": { value: "-1.3%" } },',
                      '        y: { "0": { value: "-5.1%" } },' ],
                    [ '        "sizeProportional.x": { "0": { value: 1.026 } },',
                      '        "sizeProportional.x": { "0": { value: 1.179 } },' ],
                    [ '        "sizeProportional.y": { "0": { value: 1.026 } },',
                      '        "sizeProportional.y": { "0": { value: 1.103 } },' ],
                    [ '      "haiku:de41dd6c8a05": {',
                      '      "haiku:90d46158e964": {' ],
                    [ '      "haiku:1e9c35ac96c6": {',
                      '      "haiku:d4f4ccddd125": {' ],
                    [ '        dx: { "0": { value: "0" } },',
                      '        dx: { "0": { value: "3" } },' ],
                    [ '      "haiku:1840060048d0": {',
                      '      "haiku:ab0bad0d0653": {' ],
                    [ '      "haiku:ac03047cad46": {',
                      '      "haiku:eaef2e521ac0": {' ],
                    [ '      "haiku:b31adeff7e59": {',
                      '      "haiku:9430989e7e87": {' ],
                    [ '        x: { "0": { value: "-1.3%" } },',
                      '        x: { "0": { value: "-3.8%" } },' ],
                    [ '        y: { "0": { value: "-1.3%" } },',
                      '        y: { "0": { value: "-3.8%" } },' ],
                    [ '        "sizeProportional.x": { "0": { value: 1.026 } },',
                      '        "sizeProportional.x": { "0": { value: 1.1540000000000001 } },' ],
                    [ '        "sizeProportional.y": { "0": { value: 1.026 } },',
                      '        "sizeProportional.y": { "0": { value: 1.077 } },' ],
                    [ '      "haiku:56d3ccdc1f97": {',
                      '      "haiku:0eb0bd9e3a38": {' ],
                    [ '        dx: { "0": { value: "0" } },',
                      '        dx: { "0": { value: "-2" } },' ],
                    [ '      "haiku:fd6063d8da1b": {',
                      '      "haiku:cd34e818fec7": {' ],
                    [ '      "haiku:6ac6b866f33b": {',
                      '      "haiku:59a3ebe06129": {' ],
                    [ '      "haiku:7356ce50d6b2": {',
                      '      "haiku:73d511397028": {' ],
                    [ '      "haiku:7368c6f5f95f": {',
                      '      "haiku:371d5ed25ab5": {' ],
                    [ '        filter: { "0": { value: "url(#filter-4-0d1946)" } }',
                      '        filter: { "0": { value: "url(#filter-4-ed212b)" } }' ],
                    [ '      "haiku:83e3f6f9d893": {',
                      '      "haiku:c7d3da674e42": {' ],
                    [ '        fill: { "0": { value: "url(#linearGradient-1-0d1946)" } },',
                      '        fill: { "0": { value: "url(#linearGradient-1-ed212b)" } },' ],
                    [ '      "haiku:691cafc4d391": {',
                      '      "haiku:fa3a58408995": {' ],
                    [ '        filter: { "0": { value: "url(#filter-5-0d1946)" } }',
                      '        filter: { "0": { value: "url(#filter-5-ed212b)" } }' ],
                    [ '      "haiku:8541def48ede": {',
                      '      "haiku:416550c97d0a": {' ],
                    [ '        stroke: { "0": { value: "url(#linearGradient-2-0d1946)" } },',
                      '        stroke: { "0": { value: "url(#linearGradient-2-ed212b)" } },' ],
                    [ '            attributes: { "haiku-id": "82ac01ff85bd" },',
                      '            attributes: { "haiku-id": "c609e9b9085a" },' ],
                    [ '                  "haiku-id": "527ffa2aea92",',
                      '                  "haiku-id": "78ae69ba3b81",' ],
                    [ '                  id: "linearGradient-1-0d1946"',
                      '                  id: "linearGradient-1-ed212b"' ],
                    [ '                    attributes: { "haiku-id": "dcce2c8bee2b" },',
                      '                    attributes: { "haiku-id": "29d88e03452f" },' ],
                    [ '                    attributes: { "haiku-id": "5d53452f8b57" },',
                      '                    attributes: { "haiku-id": "40de3f487875" },' ],
                    [ '                  "haiku-id": "0d7370f8eeb0",',
                      '                  "haiku-id": "d82e2d033926",' ],
                    [ '                  id: "linearGradient-2-0d1946"',
                      '                  id: "linearGradient-2-ed212b"' ],
                    [ '                    attributes: { "haiku-id": "86d10d02313c" },',
                      '                    attributes: { "haiku-id": "2fd45ce513fd" },' ],
                    [ '                    attributes: { "haiku-id": "1e1099328958" },',
                      '                    attributes: { "haiku-id": "6235d0cbb13d" },' ],
                    [ '                  "haiku-id": "40792f5327a9",',
                      '                  "haiku-id": "a8b57a26d6c5",' ],
                    [ '                  id: "filter-4-0d1946"',
                      '                  id: "filter-4-ed212b"' ],
                    [ '                    attributes: { "haiku-id": "de41dd6c8a05" },',
                      '                    attributes: { "haiku-id": "90d46158e964" },' ],
                    [ '                    attributes: { "haiku-id": "1e9c35ac96c6" },',
                      '                    attributes: { "haiku-id": "d4f4ccddd125" },' ],
                    [ '                    attributes: { "haiku-id": "1840060048d0" },',
                      '                    attributes: { "haiku-id": "ab0bad0d0653" },' ],
                    [ '                    attributes: { "haiku-id": "ac03047cad46", type: "matrix" },',
                      '                    attributes: { "haiku-id": "eaef2e521ac0", type: "matrix" },' ],
                    [ '                  "haiku-id": "b31adeff7e59",',
                      '                  "haiku-id": "9430989e7e87",' ],
                    [ '                  id: "filter-5-0d1946"',
                      '                  id: "filter-5-ed212b"' ],
                    [ '                    attributes: { "haiku-id": "56d3ccdc1f97" },',
                      '                    attributes: { "haiku-id": "0eb0bd9e3a38" },' ],
                    [ '                    attributes: { "haiku-id": "fd6063d8da1b" },',
                      '                    attributes: { "haiku-id": "cd34e818fec7" },' ],
                    [ '                    attributes: { "haiku-id": "6ac6b866f33b", type: "matrix" },',
                      '                    attributes: { "haiku-id": "59a3ebe06129", type: "matrix" },' ],
                    [ '            attributes: { "haiku-id": "7356ce50d6b2", id: "Page-1" },',
                      '            attributes: { "haiku-id": "73d511397028", id: "Page-1" },' ],
                    [ '                attributes: { "haiku-id": "5ff2d2df551e", id: "Circle" },',
                      '                attributes: { "haiku-id": "f2d231c6a890", id: "Circle" },' ],
                    [ '                    attributes: { "haiku-id": "7368c6f5f95f", id: "path-3-0" },',
                      '                    attributes: { "haiku-id": "371d5ed25ab5", id: "path-3-0" },' ],
                    [ '                    attributes: { "haiku-id": "83e3f6f9d893", id: "path-3-1" },',
                      '                    attributes: { "haiku-id": "c7d3da674e42", id: "path-3-1" },' ],
                    [ '                    attributes: { "haiku-id": "691cafc4d391", id: "path-3-2" },',
                      '                    attributes: { "haiku-id": "fa3a58408995", id: "path-3-2" },' ],
                    [ '                    attributes: { "haiku-id": "8541def48ede", id: "path-3-3" },',
                      '                    attributes: { "haiku-id": "416550c97d0a", id: "path-3-3" },' ] ]))
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[3](design)', (t) => {
  t.plan(2)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-design-03')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/PercyNose.svg'), PERCY_NOSE_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/PercyNose.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
            if (err) throw err
            fse.outputFileSync(path.join(folder, 'designs/PercyNose.svg'), PERCY_NOSE_2) // Other one
            return ac0.mergeDesigns({ 'designs/PercyNose.svg': true }, { from: 'test' }, (err) => {
              if (err) throw err
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                  if (err) throw err
                  const diffs = []
                  const lines1 = contents1.split('\n')
                  const lines2 = contents2.split('\n')
                  lines1.forEach((line, index) => {
                    if (line !== lines2[index]) {
                      diffs.push([line, lines2[index]])
                    }
                  })
                  t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:a0e14f09ae5c\": {","      \"haiku:c2a28aefa4c8\": {"],["      \"haiku:8badb1453e69\": {","      \"haiku:f42ced9b74e3\": {"],["      \"haiku:dcc066161fdc\": {","      \"haiku:e6df6ff18ccf\": {"],["      \"haiku:df0ec458f3bd\": { \"translation.y\": { \"0\": { value: 72.38 } } },","      \"haiku:50750a8ad93f\": { \"translation.y\": { \"0\": { value: 72.38 } } },"],["      \"haiku:f4c2435f153f\": {","      \"haiku:f17bf59e943c\": {"],["      \"haiku:81a1f786cc3e\": {","      \"haiku:00fce37061c1\": {"],["      \"haiku:bb5037837220\": {","      \"haiku:f6d71090ee89\": {"],["      \"haiku:5cfeb317cd68\": {","      \"haiku:62c41592c32c\": {"],["        fill: { \"0\": { value: \"#FF5E87\" } },","        fill: { \"0\": { value: \"#000000\" } },"],["      \"haiku:cec6c7eff5e5\": {","      \"haiku:32d3475bb43d\": {"],["        fill: { \"0\": { value: \"#FF5E87\" } },","        fill: { \"0\": { value: \"#000000\" } },"],["            attributes: { \"haiku-id\": \"a0e14f09ae5c\", id: \"Page-1\" },","            attributes: { \"haiku-id\": \"c2a28aefa4c8\", id: \"Page-1\" },"],["                attributes: { \"haiku-id\": \"8badb1453e69\", id: \"Screen-3\" },","                attributes: { \"haiku-id\": \"f42ced9b74e3\", id: \"Screen-3\" },"],["                    attributes: { \"haiku-id\": \"dcc066161fdc\", id: \"percy\" },","                    attributes: { \"haiku-id\": \"e6df6ff18ccf\", id: \"percy\" },"],["                        attributes: { \"haiku-id\": \"df0ec458f3bd\", id: \"nose\" },","                        attributes: { \"haiku-id\": \"50750a8ad93f\", id: \"nose\" },"],["                              \"haiku-id\": \"f4c2435f153f\",","                              \"haiku-id\": \"f17bf59e943c\","],["                              \"haiku-id\": \"81a1f786cc3e\",","                              \"haiku-id\": \"00fce37061c1\","],["                              \"haiku-id\": \"bb5037837220\",","                              \"haiku-id\": \"f6d71090ee89\","],["                              \"haiku-id\": \"5cfeb317cd68\",","                              \"haiku-id\": \"62c41592c32c\","],["                              \"haiku-id\": \"cec6c7eff5e5\",","                              \"haiku-id\": \"32d3475bb43d\","]]))
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.instantiateComponent[2](component)', (t) => {
  t.plan(11)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, modpath, (err, contents) => {
            if (err) throw err
            t.ok(contents.length,15402,'content checksum ok')
            return ac0.instantiateComponent(`./${modpath}`, {}, { from: 'test' }, (err, info, mana) => {
              t.error(err, 'no err upon instantiation')
              t.equal(info.center.x, 0, 'info center is returned')
              t.equal(mana.attributes.source, '../designs_path_svg/code.js', 'rel source is in mana attribute')
              const timeline = ac0.getReifiedBytecode().timelines.Default['haiku:' + mana.attributes['haiku-id']]
              t.deepEqual(timeline, {
                'style.position': { '0': { value: 'absolute' } },
                'style.margin': { '0': { value: '0' } },
                'style.padding': { '0': { value: '0' } },
                'style.border': { '0': { value: '0' } },
                'sizeAbsolute.x': { '0': { value: 99 } },
                'sizeMode.x': { '0': { value: 1 } },
                'sizeAbsolute.y': { '0': { value: 69 } },
                'sizeMode.y': { '0': { value: 1 } },
                'style.zIndex': { '0': { value: 1 } }
              }, 'timeline is ok')
              const subtemplate = ac0.getReifiedBytecode().template.children[0]
              t.equal(subtemplate.elementName.metadata.relpath, 'code/designs_path_svg/code.js', 'el name is bytecode')
              t.deepEqual(subtemplate.attributes, { source: '../designs_path_svg/code.js', identifier: 'designs_path_svg', 'haiku-title': 'designs_path_svg', 'haiku-id': '76fc778dc382' }, 'el attrs ok')
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                  if (err) throw err
                  t.equal(contents.length, 1745, 'checksum ok')
                  var lines = contents.split('\n')
                  t.equal(lines[0], 'var Haiku = require("@haiku/core");', 'first line is haiku require')
                  t.equal(lines[1], 'var designs_path_svg = require("../designs_path_svg/code.js");', 'first line is component require')
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.deleteComponent[2](component)', (t) => {
  t.plan(6)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'delete-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, modpath, (err, contents) => {
            if (err) throw err
            t.equal(ac0.getReifiedBytecode().template.children.length,0)
            return ac0.instantiateComponent(`./${modpath}`, {}, { from: 'test' }, (err, info, mana) => {
              if (err) throw err
              return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
                if (err) throw err
                t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
                return waitUntilFileProbablyWroteToDisk(() => {
                  return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                    t.error(err, 'no err reading file after del')
                    const lines = contents.split('\n')
                    t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place at line 0', 'first line ok')
                    t.equal(lines[1],'module.exports = {', '2nd line ok')
                    fse.removeSync(folder)
                    t.ok(true)
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.pasteThing[1]', (t) => {
  t.plan(3)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'paste-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        const el1 = ac0.findElementByComponentId(mana.attributes['haiku-id'])
        const pasteable1 = el1.getClipboardPayload('test')
        return ac0.pasteThing(pasteable1, { x: 100, y: 100 }, { from: 'test' }, (err) => {
          t.error(err, 'no err from paste')
          t.equal(ac0.getReifiedBytecode().template.children[1].attributes['haiku-id'],`${mana.attributes['haiku-id']}-1fd318`)
          t.ok(ac0.getReifiedBytecode().timelines.Default[`haiku:${mana.attributes['haiku-id']}-1fd318`])
          fse.removeSync(folder)
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.batchUpsertEventHandlers[1]', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'BUEH-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      const ac0 = project.getCurrentActiveComponent()
      const haikuId = ac0.getArtboard().getElementHaikuId()
      const selectorName = `haiku:${haikuId}`
      return ac0.batchUpsertEventHandlers(selectorName, SERIALIZED_EVENTS, { from: 'test' }, (err) => {
        if (err) throw err
        t.equal(typeof ac0.getReifiedBytecode().eventHandlers[selectorName].click.handler, 'function', 'handler is fn')
        fse.removeSync(folder)
      })
    })
  })
})

const SERIALIZED_EVENTS = {
  "click": {
    "handler": {
      "__function": {
        "params": ["event"],
        "body": "/** action logic goes here */\nconsole.log(12);",
        "type":"FunctionExpression",
        "name":null
      }
    }
  }
}

const PATH_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="99px" height="69px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-283.000000, -254.000000)" stroke="#979797">
              <path d="M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`

const PATH_SVG_2 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="777px" height="111px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-200.000000, -500.000000)" stroke="#AAAAAA">
              <path d="M300.000001,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`

const PATH_SVG_3 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="68px" height="89px" viewBox="0 0 68 89" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Path 4</title>
      <desc>Created with sketchtool.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M17.5653834,3.24972415 C8.78389065,8.63238435 1.15496876,16.867694 20.7239544,24.5300652 C26.9448788,26.965911 36.76719,18.3562061 40.7500129,23.7200077 L44.6500477,25.5459034 C45.3309428,26.4628877 45.2634552,28.0088797 44.6500477,28.972316 C40.283801,35.8300754 36.7692766,43.9422339 30.0363492,48.4986212 C3.94577219,66.1549492 0.849351892,3.9426716 3.58535894,68.9917693 C3.62002238,69.8158993 4.34989854,70.8001994 5.16954396,70.8927913 C10.2187973,71.4631845 15.5113964,72.2300336 20.4136501,70.8927913 C28.6541842,68.6449293 37.6053859,66.2696073 43.774663,60.3620439 C45.8662922,58.3591461 40.9520483,55.2350407 38.9698462,53.1237882 C33.5723273,47.3748662 29.5781845,37.84985 21.7495917,36.9030402 L17.5817152,35.2600606 C14.4654507,34.8831717 11.1402095,36.2600956 8.16479687,35.2600606 C-9.62704708,29.2802293 10.6327249,17.7007378 18.3329782,16.553612 C31.2729233,14.6259162 44.4263319,12.9706265 57.4835796,13.7870043 C60.0375498,13.9466861 61.6631672,17.0364793 62.791416,19.3332851 C71.3885276,36.8346515 68.6320193,65.946643 43.7550649,67.2671308 C36.7209402,67.6405075 28.1558195,61.13799 22.6903036,65.5816886 C17.5802963,69.7363434 20.9179086,78.7534312 21.5666755,85.3072418 C21.698505,86.6389764 23.5484756,87.3731718 24.8689663,87.5904281 C58.1282882,93.0624832 24.1319409,61.5570061 21.4196893,47.600372 C19.9891261,40.2390173 19.2998726,32.5854165 20.1752058,25.1376083 C23.1677916,-0.324932459 33.2960952,10.7898797 20.3548556,0.502714662 L17.5653834,3.24972415 Z" id="Path-4" stroke="#979797" fill="#FF0000"></path>
      </g>
  </svg>
`

const PATH_SVG_4 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="48px" height="49px" viewBox="0 0 58 59" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Path 4</title>
      <desc>Created with sketchtool.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
          <path d="M17.5653834,3.24972415 C8.78389065,8.63238435 22.2222,16.867694 20.7239544,24.5300652 C26.9448788,26.965911 36.76719,18.3562061 40.7500129,23.7200077 L44.6500477,25.5459034 C45.3309428,26.4628877 45.2634552,28.0088797 44.6500477,28.972316 C40.283801,35.8300754 36.7692766,43.9422339 30.0363492,48.4986212 C3.94577219,66.1549492 0.849351892,3.9426716 3.58535894,68.9917693 C3.62002238,69.8158993 4.34989854,70.8001994 5.16954396,70.8927913 C10.2187973,71.4631845 15.5113964,72.2300336 20.4136501,70.8927913 C28.6541842,68.6449293 37.6053859,66.2696073 43.774663,60.3620439 C45.8662922,58.3591461 40.9520483,55.2350407 38.9698462,53.1237882 C33.5723273,47.3748662 29.5781845,37.84985 21.7495917,36.9030402 L17.5817152,35.2600606 C14.4654507,34.8831717 11.1402095,36.2600956 8.16479687,35.2600606 C-9.62704708,29.2802293 10.6327249,17.7007378 18.3329782,16.553612 C31.2729233,14.6259162 44.4263319,12.9706265 57.4835796,13.7870043 C60.0375498,13.9466861 61.6631672,17.0364793 62.791416,19.3332851 C71.3885276,36.8346515 68.6320193,65.946643 43.7550649,67.2671308 C36.7209402,67.6405075 28.1558195,61.13799 22.6903036,65.5816886 C17.5802963,69.7363434 20.9179086,78.7534312 21.5666755,85.3072418 C21.698505,86.6389764 23.5484756,87.3731718 24.8689663,87.5904281 C58.1282882,93.0624832 24.1319409,61.5570061 21.4196893,47.600372 C19.9891261,40.2390173 19.2998726,32.5854165 20.1752058,25.1376083 C23.1677916,-0.324932459 33.2960952,10.7898797 20.3548556,0.502714662 L17.5653834,3.24972415 Z" id="Path-4" stroke="#ABABAB" fill="#DDEEEE"></path>
      </g>
  </svg>
`

const RECT_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="79px" height="79px" viewBox="0 0 79 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Rectangle</title>
      <desc>Created with sketchtool.</desc>
      <defs>
          <rect id="path-1" x="0" y="0" width="79" height="79"></rect>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rectangle">
              <use fill="#420000" fill-rule="evenodd" xlink:href="#path-1"></use>
              <rect stroke="#9200FF" stroke-width="16" x="8" y="8" width="63" height="63"></rect>
          </g>
      </g>
  </svg>
`

const CIRCLE_SVG_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#EEEEEE" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#C8C8C8" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`

const CIRCLE_SVG_2 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#D13434" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#4F78EC" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-5.1%" y="-5.1%" width="117.9%" height="110.3%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="3" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-3.8%" y="-3.8%" width="115.4%" height="107.7%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="-2" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`

const PERCY_NOSE_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="28px" viewBox="0 0 42 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>nose</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-3" transform="translate(-35.000000, -253.000000)">
            <g id="percy" transform="translate(35.000000, 181.000000)">
                <g id="nose" transform="translate(0.000000, 72.378378)">
                    <rect id="Rectangle-2" fill="#FFFFFF" x="0" y="0" width="41.3401361" height="26.7027027" rx="13.3513514"></rect>
                    <path d="M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z" id="Rectangle-2-Copy" fill="#FEDFE6"></path>
                    <rect id="Rectangle-2-Copy-2" stroke="#FF5E87" stroke-width="3.5" x="1.75" y="1.75" width="37.8401361" height="23.2027027" rx="11.6013514"></rect>
                    <ellipse id="Oval-4" fill="#FF5E87" cx="10.8605442" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                    <ellipse id="Oval-4-Copy" fill="#FF5E87" cx="24.8741497" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                </g>
            </g>
        </g>
    </g>
</svg>
`

const PERCY_NOSE_2 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="28px" viewBox="0 0 42 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>nose</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-3" transform="translate(-35.000000, -253.000000)">
            <g id="percy" transform="translate(35.000000, 181.000000)">
                <g id="nose" transform="translate(0.000000, 72.378378)">
                    <rect id="Rectangle-2" fill="#FFFFFF" x="0" y="0" width="41.3401361" height="26.7027027" rx="13.3513514"></rect>
                    <path d="M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z" id="Rectangle-2-Copy" fill="#FEDFE6"></path>
                    <rect id="Rectangle-2-Copy-2" stroke="#FF5E87" stroke-width="3.5" x="1.75" y="1.75" width="37.8401361" height="23.2027027" rx="11.6013514"></rect>
                    <ellipse id="Oval-4" fill="#000000" cx="10.8605442" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                    <ellipse id="Oval-4-Copy" fill="#000000" cx="24.8741497" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                </g>
            </g>
        </g>
    </g>
</svg>
`
