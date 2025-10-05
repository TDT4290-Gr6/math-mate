import { useRef, useEffect, useState } from 'react';

type TitleProps = {
    title: string;
};

/**
 * A React component that displays a title with a dynamic underline.
 *
 * The underline width automatically matches the width of the title text.
 *
 * @param {TitleProps} props - The props for the component.
 * @param {string} props.title - The text to display as the title.
 * @returns {JSX.Element} A title with a dynamically sized underline.
 */
export default function Title({ title }: TitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [underlineWidth, setUnderlineWidth] = useState(0);

    /**
     * Effect to update the underline width whenever the title changes.
     */
    useEffect(() => {
        if (titleRef.current) {
            setUnderlineWidth(titleRef.current.offsetWidth);
        }
    }, [title]);

    return (
        <div className="flex flex-col items-start pb-4">
            <h2
                ref={titleRef}
                className="text-xl font-semibold"
            >
                {title}
            </h2>
            <div
                className="mt-1 h-1 rounded-full bg-[var(--accent)]"
                style={{ width: underlineWidth }}
            />
        </div>
    );
}
