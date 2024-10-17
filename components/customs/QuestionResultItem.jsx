import React from 'react';
import { Text, View } from 'react-native';

function QuestionResultItem({ question = {} }) {
	return (
		<View
			key={question._id}
			className={` ${question.correct ? 'border-l-green-500' : 'border-l-red-500'} mb-4 p-4 bg-slate-200/60 rounded-md border-l-8`}
		>
			<Text className="text-lg text-slate-500 font-pregular mb-4 border-b-[1px] border-slate-300">
				{question.question_id.question_excerpt}
			</Text>

			{question.question_id.question_answer_ids.map((answer) => {
				const isUserAnswer = question.answer.some(
					(userAns) => userAns._id === answer._id
				);
				const isCorrectAnswer =
					question.question_id.correct_answer_ids.includes(
						answer._id
					);

				return (
					<View
						key={answer._id}
						className="flex-row items-center mb-1"
					>
						<View
							className={`w-3 h-3 rounded-full mr-2 bg-slate-400/30`}
						/>
						<Text
							className={`text-base font-pregular text-slate-500`}
						>
							{answer.text}
						</Text>
					</View>
				);
			})}
		</View>
	);
}

export default QuestionResultItem;
