/* tslint:disable:max-classes-per-file */

import { JSONObject } from 'ts-json-object';

export class Tag extends JSONObject {
  @JSONObject.required
  // @ts-ignore
  tagType: string;

  @JSONObject.required
  // @ts-ignore
  start: number;

  @JSONObject.required
  // @ts-ignore
  end: number;
}

export class Example extends JSONObject {
  @JSONObject.required
  // @ts-ignore
  text: string;

  @JSONObject.required
  // @ts-ignore
  intent: string;

  @JSONObject.required
  // @ts-ignore
  tags: Tag[];
}

export class AgentData extends JSONObject {
  @JSONObject.required
  // @ts-ignore
  intents: string[];

  @JSONObject.required
  // @ts-ignore
  tagTypes: string[];

  @JSONObject.required
  // @ts-ignore
  examples: Example[];
}

class Book extends JSONObject {
  @JSONObject.required
  // @ts-ignore
  name: string;
  @JSONObject.optional
  // @ts-ignore
  summary?: string;
}
