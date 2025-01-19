import testExecutionRoutes from './content-api/testExecutionRoutes';
import answerRoutes from './content-api/answerRoutes';
import questionRoutes from './content-api/questionRoutes';
import categoryRoutes from './content-api/categoryRoutes';
import testsRoutes from './content-api/testsRoutes';


export default {
	"content-api": {
		type: "content-api",
		routes: [
			...testsRoutes,
			...testExecutionRoutes,
			...answerRoutes,
			...questionRoutes,
			...categoryRoutes,
		],
	},
};
