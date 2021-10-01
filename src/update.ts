import axios, { Axios, AxiosResponse } from "axios";
import { greenBright, grey, redBright, yellowBright } from "chalk";
import extract from "extract-zip";
import { createWriteStream, existsSync, rmdir, rmdirSync } from "fs";
import inquirer from "inquirer";
import marked from "marked";
import TerminalRenderer from "marked-terminal";
import { platform } from "os";
import { join } from "path";
import { VERSION } from "../index";
import { getUserPreference } from "./settings";

interface GithubReleaseAssets {
  url: string;
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
}

interface GithubRelease {
  url: string;
  id: number;
  tag_name: string;
  name: string;
  assets: Array<GithubReleaseAssets>;
  body: string;
}

export class AutoUpdate {
  private readonly userUpdatePreferences: Map<string, any> = getUserPreference([
    "getBetaUpdates",
    "autoUpdateTermex",
  ]);

  private getPlatformAssets(
    assets: Array<GithubReleaseAssets>
  ): GithubReleaseAssets | undefined {
    const userPlatform: string = platform().startsWith("win")
      ? "windows"
      : platform();
    const assetFilename: string = `termex-${
      userPlatform == "darwin" ? "macos" : userPlatform
    }.zip`;
    return assets.filter((asset: GithubReleaseAssets): boolean => {
      return asset.name == assetFilename;
    })[0];
  }

  private getUpdate(release: GithubRelease) {
    const asset: GithubReleaseAssets = this.getPlatformAssets(release.assets);
    console.log(
      `Downloading Update:${asset.name}[${Math.round(asset.size / 10e5)} Mb]`
    );

    const downloadedZip: string = join(__dirname, "termex.zip");
    axios
      .get(asset.browser_download_url, { responseType: "stream" })
      .then((response: AxiosResponse<any>): void => {
        response.data.pipe(createWriteStream(downloadedZip));
      });
    if (existsSync(join(__dirname, "termex-latest"))) {
      rmdirSync(join(__dirname, "termex-latest"));
    }
    extract(downloadedZip, { dir: join(__dirname, "termex-latest") })
      .then((value: void): void => {
        console.log(greenBright("Installation complete"));
      })
      .catch((error: any): void => {
        console.log(redBright(`Installation failed:${error}`));
      });
  }

  public isUpdateAvailable() {
    require("child_process").exec(
      "npm install termex -g",
      function (err, stdout) {
        console.log(err);
        if (err) return;
        console.log(yellowBright(stdout));
        return;
      }
    );

    axios
      .get("https://api.github.com/repos/pranavbaburaj/termex/releases")
      .then((response: AxiosResponse<any>): void => {
        const latestVersion: GithubRelease = response.data[0] as GithubRelease;
        const { tag_name, name, body } = latestVersion;
        if (tag_name == VERSION) {
          return;
        }
        marked.setOptions({ renderer: new TerminalRenderer() });
        console.log(greenBright(`Update:${tag_name}`));
        console.log(yellowBright(name));
        console.log(marked(body));

        if (!this.userUpdatePreferences.get("autoUpdateTermex")) {
          inquirer
            .prompt({
              type: "confirm",
              message: "New version found. Update?",
              default: "y",
            })
            .then((response: any): void => {
              // TODO: Implement user permission
              console.log(response);
            })
            .catch((exception: any) => {});
        }
        this.getUpdate(latestVersion);
      })
      .catch((exception: any): void => {
        // console.log(redBright(exception))
      });
  }
}

const update = new AutoUpdate().isUpdateAvailable();
