import authentication from './authentication.json';
import account from './account.json';
import devOps from './devOps.json';
import _ from 'lodash';


let combinedJson=_.merge(authentication,account,devOps)
export default combinedJson ;
