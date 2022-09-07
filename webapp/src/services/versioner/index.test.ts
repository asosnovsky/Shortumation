import { parseVersion, Version } from ".";
import { VersionComp, compareVersions } from "./index";

for (const [verStr, expectedVer] of [
  [
    "1.2.3",
    {
      main: 1,
      minor: 2,
      patch: 3,
      extra: "",
    },
  ],
  [
    "20.1.10",
    {
      main: 20,
      minor: 1,
      patch: 10,
      extra: "",
    },
  ],
  [
    "20.1.10-g1234",
    {
      main: 20,
      minor: 1,
      patch: 10,
      extra: "g1234",
    },
  ],
  ["x.1.10-g1234", null],
  ["2.x1.10-g1234", null],
  ["2.123x.10-g1234", null],
  ["2.123.10g1234", null],
] as [string, Version | null][]) {
  test(`parse version - ${verStr} to be ${JSON.stringify(expectedVer)}`, () => {
    const version = parseVersion(verStr);
    expect(version).toEqual(expectedVer);
  });
}
for (const [lh, rh, comp] of [
  [parseVersion("1.1.0"), parseVersion("1.1.0"), null],
  [null, null, null],
  [parseVersion("1.1.0"), parseVersion("1.1.0"), null],
  [parseVersion("1.2.0"), parseVersion("1.1.0"), "left"],
  [parseVersion("1.2.0"), parseVersion("1.3.0"), "right"],
  [parseVersion("1.2.0"), parseVersion("2.2.0"), "right"],
  [parseVersion("1.2.0"), parseVersion("1.2.1"), "right"],
  [parseVersion("3.2.1"), parseVersion("1.2.1"), "right"],
  [parseVersion("1.3.1"), parseVersion("1.2.1"), "right"],
  [parseVersion("1.2.2"), parseVersion("1.2.1"), "right"],
] as Array<[Version | null, Version | null, VersionComp]>)
  test(`compare versions ${lh} ? ${rh} = ${comp}`, () => {
    expect(compareVersions(lh, rh) === comp);
  });
