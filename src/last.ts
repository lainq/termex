import { yellowBright } from "chalk";
import { homedir } from "os";
import { HistoryObject, TermexHistory } from "./history";
import { initializeTermex } from "./init";
import { checkFileExists} from "./utils";

export const openLast = () => {
  const history: Array<HistoryObject> = TermexHistory.readFromHistory().map(
    (element: string): HistoryObject => {
      return JSON.parse(element) as HistoryObject;
    }
  );
  if (history.length == 0) {
    console.log(yellowBright("You haven't opened anything with termex"));
    return null;
  }
  const lastElement: HistoryObject = history[history.length - 1];
  const exists: boolean = checkFileExists(
    lastElement.filename,
    lastElement.isDirectory
  );
  initializeTermex(exists ? lastElement.filename : homedir(), []);
};
