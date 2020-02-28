/* eslint-disable @typescript-eslint/camelcase */
import { customsearch_v1 } from 'googleapis';

export class GoogleCustomSearch {
  private googleSearchCseId: string;
  private googleSearchApiKey: string;
  private customSearch: customsearch_v1.Customsearch;
  constructor(
    googleSearchCseId: string,
    googleSearchApiKey: string,
    customSearch: customsearch_v1.Customsearch,
  ) {
    this.googleSearchCseId = googleSearchCseId;
    this.googleSearchApiKey = googleSearchApiKey;
    this.customSearch = customSearch;
  }
  /* eslint-enable @typescript-eslint/camelcase */

  async googleImage(query: string): Promise<Array<string>> {
    const res = await this.customSearch.cse.list({
      cx: this.googleSearchCseId,
      auth: this.googleSearchApiKey,
      q: query,
      searchType: 'image',
      safe: 'high',
      fields: 'items(link)',
    });
    if (res.status !== 200) {
      throw new Error(`Bad HTTP response. status: ${res.status}`);
    }
    return res.data.items.map(i => i.link);
  }
}
