import { BTCStateProvider } from '../btc/btc';

export class LTCStateProvider extends BTCStateProvider {
  constructor(chain = 'LTC') {
    super(chain);
  }
}
