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
 * @param {'h2' | 'h3' | 'h4' | 'span'} [props.titleComponent] - The HTML element to use for the title.
 * @returns {JSX.Element} A title with a dynamically sized underline.
 */
export default function Title({
    title,
    size = 24,
    titleComponent = 'h2',
}: TitleProps) {
    const TitleComponent = titleComponent;

    return (
        <div className="mb-2 pb-4">
            <TitleComponent
                style={{ fontSize: `${size}px` }}
                className="after:bg-accent relative w-fit text-xl font-semibold after:absolute after:right-0 after:-bottom-2 after:left-0 after:h-1 after:w-full after:rounded-full"
            >
                {title}
            </TitleComponent>
        </div>
    );
}
