import testRoutes from './content-api/testRoutes';
import answerRoutes from './content-api/answerRoutes';
import questionRoutes from './content-api/questionRoutes';
import categoryRoutes from './content-api/categoryRoutes';

export default {
	"content-api": {
		type: "content-api",
		routes: [
			...testRoutes,
			...answerRoutes,
			...questionRoutes,
			...categoryRoutes,
		],
	},
};
