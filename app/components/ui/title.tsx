import { useRef, useEffect, useState } from 'react';

type TitleProps = {
    title: string;
    size?: number;
    titleComponent?: 'h2' | 'h3' | 'h4' | 'span';
};

/**
 * A React component that displays a title with a dynamic underline.
 *
 * The underline width automatically matches the width of the title text.
 *
 * @param {TitleProps} props - The props for the component.
 * @param {string} props.title - The text to display as the title.
 * @param {number} [props.size] - The font size of the title in pixels.
 * @returns {JSX.Element} A title with a dynamically sized underline.
 */
export default function Title({
    title,
    size = 24,
    titleComponent = 'h2',
}: TitleProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [underlineWidth, setUnderlineWidth] = useState(0);
    const TitleComponent = titleComponent;

    useEffect(() => {
        if (titleRef.current) {
            setUnderlineWidth(titleRef.current.offsetWidth);
        }
    }, [title, size]);

    return (
        <div className="flex flex-col items-start pb-4">
            <TitleComponent
                ref={titleRef}
                style={{ fontSize: `${size}px` }}
                className="text-xl font-semibold"
            >
                {title}
            </TitleComponent>
            <div
                className="mt-1 h-1 rounded-full bg-[var(--accent)]"
                style={{ width: underlineWidth }}
            />
        </div>
    );
}
