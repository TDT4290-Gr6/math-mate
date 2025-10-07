import Title from "./title";


interface QuestionCardProps {
  description: string;
}

export default function QuestionCard({
    description,
}: QuestionCardProps) {
    return (
        <div className="mx-4 my-4 max-w-[50vw] rounded-xl bg-[var(--background)] p-4 shadow-sm">
            <Title title={"Question: "} />

            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">
                {description}
            </p>
        </div>
    );
}




