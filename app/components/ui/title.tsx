import { useRef, useEffect, useState } from 'react';

type TitleProps = {
    title: string;
};

export default function Title({ title }: TitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [underlineWidth, setUnderlineWidth] = useState(0);

    useEffect(() => {
        if (titleRef.current) {
            setUnderlineWidth(titleRef.current.offsetWidth);
        }
    }, [title]);

    return (
        <div className="flex flex-col items-start pb-4">
            <h2 ref={titleRef} className="text-xl font-semibold text-[var(--foreground)]">
                {title}
            </h2>
            <div
                className="mt-1 h-1 rounded-full bg-[var(--accent)]"
                style={{ width: underlineWidth }}
            />
        </div>
    );
}
