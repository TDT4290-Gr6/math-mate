import { Card } from './card';
import Title from './title';

interface QuestionCardProps {
    description: string;
}

export default function QuestionCard({ description }: QuestionCardProps) {
    return (
        <Card className="max-w-[50vw] p-4 ">
            <Title title={'Question: '} />
            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">
                {description}
            </p>
        </Card>
    );
}
