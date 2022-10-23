import authentication from './authentication.json';
import account from './account.json';
import devOps from './devOps.json';
import config from './configuration.json';
import everHour from './everHour.json';
import comment from './comment.json';
import _ from 'lodash';


let combinedJson = _.merge(authentication, account, devOps, config, everHour, comment)
export default combinedJson;
