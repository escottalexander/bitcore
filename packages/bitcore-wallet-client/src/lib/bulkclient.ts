'use strict';

const $ = require('preconditions').singleton();
const Client = require('./request');

// extending Request reduces redundancy

export class BulkClient extends Client {
  // inherits static variables from Request
  // inherits all class methods from Request

  /**
   * @description BulkClient constructor
   * @param {String} url base URL for client
   * @param {Object} opts configuration values
   * @constructor
   */
  constructor(url?, opts?) {
    super(url, opts);
    // (add any additional configuration here)
  }

  /**
   * @description I isolated the part that was different
   * @override
   */
  _populateAuth(
    headers: any,
    signingParams: { method: string; url: string; args: any }
  ) {
    if (this.credentials && this.credentials.length) {
      headers['x-multi-credentials'] = JSON.stringify(
        this.credentials.map(cred => ({
          'x-identity': cred.copayerId,
          'x-signature': this._signRequest({
            ...signingParams,
            privKey: cred.requestPrivKey
          })
        }))
      );
    }
  }

  checkStateOfMultipleCredentials(failureMessage) {
    if (this.credentials && this.credentials.length > 0) {
      $.checkState(
        this.credentials.every(cred => cred && cred.isComplete()),
        failureMessage || 'All credentials must be complete'
      );
    }
  }

  /**
   * @description get wallet balance for all wallets
   * @param {Array<Client>} clients an array of client instances
   * @param {String} opts.multisigContractAddress optional: MULTISIG ETH Contract Address
   * @param {Function} cb
   */
  getBalanceAll(clients, cb) {
    // parse out all of the credentials from each of the clients
    const credentials = clients.map(({ credentials }) => credentials);
    this.setCredentials(credentials);

    this.checkStateOfMultipleCredentials(
      'Failed state: this.credentials at <getBalanceAll()>'
    );

    return this.get('/v1/balance/all/', cb);
  }
}
