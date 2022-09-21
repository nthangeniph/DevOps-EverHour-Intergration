import authentication from './authentication.json';
import account from './account.json';
import _ from 'lodash';


let combinedJson=_.merge(authentication,account)
export default combinedJson ;
