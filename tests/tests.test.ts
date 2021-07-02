import { Suite, Equal, True, False } from "oral-ts";
import { dirname, join } from "path";
import { checkFileExists } from "../src/utils";
import { Walk } from "../src/walk";

@Suite()
export class WalkTest {
  @Equal(4)
  public testWalkDirectory() {
    const walk: any = new Walk("./assets/", []).files;
    return walk.length;
  }

  @True()
  public testCurrentDirectory() {
    const walk = new Walk(__dirname, []).files;
    return walk.length >= 1;
  }
}

@Suite()
export class UtilTest {
  @True()
  public testCurrentDirectory() {
    return checkFileExists(__dirname, true);
  }

  @False()
  public _testCurrentDirectory() {
    return checkFileExists(__filename, true);
  }
}
