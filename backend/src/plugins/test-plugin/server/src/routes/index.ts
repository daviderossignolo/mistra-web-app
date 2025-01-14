import contentApi from './content-api';
import admin from './admin';

export default {
  	"content-api": {
  		type: "content-api",
  		routes: [...contentApi["content-api"].routes],
  	},
  	admin: {
  		type: "admin",
  		routes: [...admin],
  	},
};
