import { BTCStateProvider } from '../btc/btc';

export class DOGEStateProvider extends BTCStateProvider {
  constructor(chain = 'DOGE') {
    super(chain);
  }
}
