import * as yaml from "js-yaml";
import { useEffect, useState } from "react";
import { ApiWaitable } from "services/api/types";
import { useCookies } from "react-cookie";
import { useConfirm } from "material-ui-confirm";
import { useLang } from "services/lang";

export const useVersioner = () => {
  const [
    cookies,
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["versionUpdateNotifier"]);
  const [latestVersion, setLatestVersion] = useState<
    ApiWaitable<Version | null>
  >({
    ready: false,
  });
  const current = parseVersion(
    process.env.REACT_APP_BUILD_VERSION?.slice(1) ?? "0.0.0"
  );
  const confirm = useConfirm();
  const lang = useLang();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/asosnovsky/Shortumation/main/config.yaml"
    )
      .then(async (resp) => {
        if (resp.ok) {
          const dataString = await resp.text();
          const data = yaml.load(dataString) as any;
          console.log({ data, dataString });
          setLatestVersion({
            ok: true,
            ready: true,
            data: parseVersion((data.version ?? "").slice(1)),
          });
        } else {
          setLatestVersion({
            ready: true,
            ok: false,
            error: "failed parsing",
          });
        }
      })
      .catch((error) => {
        setLatestVersion({
          ready: true,
          ok: false,
          error,
        });
      });
  }, []);

  const currentVersionString = versionToString(current);
  const latestVersionString =
    latestVersion.ready && latestVersion.ok
      ? versionToString(latestVersion.data)
      : "n/a";

  if (current && latestVersion.ready && latestVersion.ok) {
    if (cookies.versionUpdateNotifier !== latestVersionString) {
      if (compareVersions(current, latestVersion.data) === "right") {
        confirm({
          title: lang.get("NEW_VERSION_AVAILABLE"),
          cancellationButtonProps: {
            style: { display: "none" },
          },
          content: (
            <div>
              <ul>
                {lang
                  .get("NEW_VERSION_AVAILABLE_BODY", {
                    latest: "v" + latestVersionString,
                    current: "v" + gicurrentVersionString,
                  })
                  .split("\n")
                  .map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
              </ul>
            </div>
          ),
        }).then(() => setCookies("versionUpdateNotifier", latestVersionString));
      }
    }
  }

  return {
    get current() {
      return currentVersionString;
    },
    get latest() {
      return latestVersionString;
    },
  };
};

export type Version = {
  main: number;
  minor: number;
  patch: number;
  extra: string;
};
export const parseVersion = (verStr: string): null | Version => {
  const verArr = verStr.split(".");
  if (verArr.length !== 3) {
    return null;
  }
  const [mainStr, minorStr, patchAndExtra] = verArr;
  let extra = "";
  let patchStr = "";
  const patchAndExtraArr = patchAndExtra.split("-");
  if (patchAndExtraArr.length === 2) {
    [patchStr, extra] = patchAndExtraArr;
  } else {
    patchStr = patchAndExtra;
  }
  try {
    const [main, minor, patch] = [mainStr, minorStr, patchStr].map(Number);
    if (
      Number.isInteger(main) &&
      Number.isInteger(minor) &&
      Number.isInteger(patch)
    ) {
      return {
        main,
        minor,
        patch,
        extra,
      };
    }
    return null;
  } catch (_: any) {
    return null;
  }
};

export type VersionComp = ReturnType<typeof compareVersions>;
export const compareVersions = (
  v1: Version | null,
  v2: Version | null
): "left" | "right" | null => {
  if (v1 === null && v2 === null) {
    return null;
  }
  if (v1 === null) {
    return "right";
  }
  if (v2 === null) {
    return "left";
  }
  for (const key of ["main", "minor", "patch"] as Array<keyof Version>) {
    if (v1[key] > v2[key]) {
      return "left";
    }
    if (v1[key] < v2[key]) {
      return "right";
    }
  }
  return null;
};

export const versionToString = (v: null | Version): string => {
  if (v) {
    let out = `${v.main}.${v.minor}.${v.patch}`;
    if (v.extra) {
      return out + `-${v.extra}`;
    }
    return out;
  }
  return "n/a";
};
