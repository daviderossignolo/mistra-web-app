import type React from "react";

interface Question {
	id: string;
	text: string;
	category: string;
}

interface QuestionSidebarProps {
	questions: Question[];
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({ questions }) => {
	// Raggruppa domande per categoria
	const categories = questions.reduce<Record<string, Question[]>>(
		(acc, question) => {
			acc[question.category] = acc[question.category] || [];
			acc[question.category].push(question);
			return acc;
		},
		{},
	);

	return (
		<div className="w-1/4 bg-gray-100 p-4">
			<h3 className="text-lg font-bold">Domande Esistenti</h3>
			{Object.entries(categories).map(([category, questions]) => (
				<div key={category} className="mb-4">
					<h4 className="font-semibold">{category}</h4>
					<ul>
						{questions.map((q) => (
							<li key={q.id}>{q.text}</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default QuestionSidebar;
