import { GraphPolicyV2 } from '@bavard/agent-config/dist/graph-policy-v2';
import { IGpHistory } from './types';

export default class GrahEditorHistory {
  private localStorageKey = 'GP_EDITOR_HISTORY';
  private maxHistoryLength = 100;

  constructor(graphPolicy: GraphPolicyV2) {
    this.localStorageKey = `${this.localStorageKey}_${graphPolicy.name}`;

    const history = this.getHistory();
    if (history.history.length === 0) {
      this.pushHistory(graphPolicy);
    }
  }

  public getHistory(): IGpHistory {
    const gpHistory: IGpHistory = JSON.parse(
      localStorage.getItem(this.localStorageKey) ||
        JSON.stringify({ history: [], index: -1 }),
    );

    return gpHistory;
  }

  public setHistory(history: IGpHistory): IGpHistory {
    localStorage.setItem(this.localStorageKey, JSON.stringify(history));
    return history;
  }

  public startHistory(gp: GraphPolicyV2): IGpHistory {
    const gpHistory: IGpHistory = {
      history: [gp.toJsonObj()],
      currentIndex: 0,
    };

    return gpHistory;
  }

  public clearHistory(): IGpHistory {
    const gpHistory: IGpHistory = {
      history: [],
      currentIndex: -1,
    };

    return gpHistory;
  }

  public pushHistory(gp: GraphPolicyV2) {
    const gpHistory = this.getHistory();

    if (gpHistory.history.length >= this.maxHistoryLength) {
      gpHistory.history.shift();
    }

    if (gpHistory.currentIndex >= 0) {
      gpHistory.history = gpHistory.history.slice(
        0,
        gpHistory.currentIndex + 1,
      );
    }

    gpHistory.history.push(gp.toJsonObj());
    gpHistory.currentIndex = gpHistory.history.length - 1;

    this.setHistory(gpHistory);
  }

  public getHistoryAtIndex(index: number): GraphPolicyV2 | undefined {
    const gpHistory = this.getHistory();

    const gpJson = gpHistory.history[index];

    if (gpJson) {
      return GraphPolicyV2.fromJsonObj(gpJson);
    }
  }

  public undoChanges(): GraphPolicyV2 {
    const gpHistory = this.getHistory();

    let currentIndex = gpHistory.currentIndex;

    if (currentIndex > 0) {
      currentIndex -= 1;
    }

    const gpJson = gpHistory.history[currentIndex];
    gpHistory.currentIndex = currentIndex;
    this.setHistory(gpHistory);

    return GraphPolicyV2.fromJsonObj(gpJson);
  }

  public redoChanges(): GraphPolicyV2 {
    const gpHistory = this.getHistory();

    let currentIndex = gpHistory.currentIndex;

    if (currentIndex < gpHistory.history.length - 1) {
      currentIndex += 1;
    }

    const gpJson = gpHistory.history[currentIndex];
    gpHistory.currentIndex = currentIndex;
    this.setHistory(gpHistory);

    return GraphPolicyV2.fromJsonObj(gpJson);
  }
}
